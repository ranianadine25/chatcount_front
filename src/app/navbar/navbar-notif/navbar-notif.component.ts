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
export class NavbarNotifComponent  implements OnInit, OnDestroy {
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
  constructor( private notificationsService: NotificationsService,
    private authService: AuthService,

    @Inject(PLATFORM_ID) private platformId: Object,
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
      });
    }
    this.socket.on("new-mission-notification", (data: any) => {
      this.unreadNotifsCount = data.totalUnreadNotifications;
    });
    console.log("thisssssnotif",this.unreadNotifsCount);
    this.getNotifications();
    this.notificationsService.getNotifications().subscribe(
      (notifications : any) => {
        this.notifications = notifications;

        this.unreadNotifsCount = this.calculateUnreadNotifications(notifications);
      },
      (error) => {
        console.error("Failed to fetch notifications:", error);
      }
    );
    let sub = this.notificationsService.onOrderNotificationReceived().subscribe(
      (notif) => {
        this.unreadNotifsCount++;
        console.log("notif", this.unreadNotifsCount);
      },
      (error) => {
        console.error("Erreur lors de la réception de notifications :", error);
      }
    );
    ;
  
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
    let count = 0;
    notifications.forEach((notification) => {
      if (!notification.seen) {
        count++;
      }
    });
    return count;
  }

  markNotificationAsRead(notificationId: string): void {
    this.notificationsService.markNotificationAsRead(notificationId).subscribe(
      () => {
        // Mettre à jour la liste des notifications et le nombre de notifications non lues si nécessaire
        this.notifications = this.notifications.filter((notification) => notification._id !== notificationId);
        this.unreadNotifsCount = this.calculateUnreadNotifications(this.notifications);
      },
      (error) => {
        console.error("Failed to mark notification as read:", error);
      }
    );
  }

  toggleNotification() {
    this.showAll = !this.showAll;
    if (this.showAll) {
      this.getNotifications(); 
    }
  }

  markAsRead() {
      this.notificationsService.markAsRed(this.currentUser?.userInfo._id).subscribe(data => {
      });
  }

  onNgbDropdownToggle($event: boolean) {
    if ($event == false) {
      if (this.unreadNotifsCount > 0) {
        console.log(this.unreadNotifsCount);
        this.markAsRead();
        this.unreadNotifsCount = 0;
        this.notifications.map(x => {
          return x;
        });
      }
    }
  }

 

  showMoreNotifications() {
    this.page++;
    this.getNotifications();
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
  }
}
