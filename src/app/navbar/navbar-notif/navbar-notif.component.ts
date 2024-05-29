import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../environment/environment';
import { NotificationsService } from './notif_service';
import { Notification } from '../notif_model';
import { AuthService } from '../../authetification/auth.service';
import { User } from '../../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';
import io from 'socket.io-client';

@Component({
  selector: 'app-navbar-notif',
  templateUrl: './navbar-notif.component.html',
  styleUrls: ['./navbar-notif.component.css']
})
export class NavbarNotifComponent implements OnInit, OnDestroy {
  public loadingData: boolean = false;
  public socket: any;

  notifications: Notification[] = [];
  lastFiveNotifications: Notification[] = [];
  public currentUser: User | null = null;

  showAll = false;
  page = 0;
  pageSize = 10;
  unreadNotifsCount = 0;
  canShowMore = true;

  subscriptions = new Subscription();
  loadingNotifs = false;
  imgPrefix = environment.apiUrl + '/avatars/';
  dropdownVisible: boolean = false;

  constructor(
    private notificationsService: NotificationsService,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.socket = io(environment.apiUrl);
    this.socket.on('connect_error', (error: any) => {
      console.error('Error connecting to socket:', error);
    });

    this.socket.on('error', (error: any) => {
      console.error('Error sending message:', error);
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        if (this.currentUser) {
          // L'utilisateur est récupéré correctement
          this.getNotifications();
        } else {
          // Gérez le cas où l'utilisateur n'est pas défini
          console.error("L'utilisateur actuel est introuvable.");
        }
      });
    }

    this.socket.on("new-mission-notification", (data: any) => {
      this.unreadNotifsCount = data.totalUnreadNotifications;
      this.getNotifications();
    });

    let sub = this.notificationsService.onOrderNotificationReceived().subscribe(
      (notif) => {
        this.unreadNotifsCount++;
        this.getNotifications();
      },
      (error) => {
        console.error("Erreur lors de la réception de notifications :", error);
      }
    );
    this.subscriptions.add(sub);
  }

  getNotifications(): void {
    this.loadingData = true;
    this.subscriptions.add(
      this.notificationsService.getNotifications().subscribe(
        (response: any) => {
          if (response && Array.isArray(response)) {
            const allNotifs = response;
            this.notifications = allNotifs;
            this.lastFiveNotifications = allNotifs.slice(-5).reverse();
            this.unreadNotifsCount = this.calculateUnreadNotifications(allNotifs);
          } else {
            this.notifications = [];
          }
        },
        (error) => {
          console.error('Erreur lors de la récupération des notifications :', error);
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }

  calculateUnreadNotifications(notifications: Notification[]): number {
    return notifications.filter(notification => !notification.seen).length;
  }

  markNotificationAsRead(notificationId: string): void {
    this.notificationsService.markNotificationAsRead(notificationId).subscribe(
      () => {
        this.notifications = this.notifications.map(notification => {
          if (notification._id === notificationId) {
            notification.seen = true;
          }
          return notification;
        });
        this.unreadNotifsCount = this.calculateUnreadNotifications(this.notifications);
      },
      (error) => {
        console.error("Failed to mark notification as read:", error);
      }
    );
  }

  toggleNotification(event: Event) {
    event.stopPropagation();
    this.showAll = !this.showAll;
  }

  markAsRead() {
    if (this.currentUser?.userInfo?._id) {
      this.notificationsService.markAsRed(this.currentUser.userInfo._id).subscribe(
        () => {
          this.unreadNotifsCount = 0;
          this.notifications.forEach(notification => notification.seen = true);
        },
        (error) => {
          console.error("Failed to mark all notifications as read:", error);
        }
      );
    } else {
      console.error("L'ID de l'utilisateur est indéfini.");
    }
  }

  onNgbDropdownToggle($event: boolean) {
    if (!$event && this.unreadNotifsCount > 0) {
      this.markAsRead();
    }
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.dropdownVisible = !this.dropdownVisible;
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
