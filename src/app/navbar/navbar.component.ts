import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../environment/environment';
import { User } from '../authetification/login/model_user';
import { AuthService } from '../authetification/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationsService } from './navbar-notif/notif_service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  public    currentSkin:string = "white";
  imgPrefix = environment.apiUrl + '/avatars/';
  public currentUser: User | null = null;
  public showNotifCenter: boolean = false;
  public notifications = [];
  notifsCount: number = 0;

  subscription = new Subscription();
  constructor(private router: Router,private authService: AuthService,@Inject(PLATFORM_ID) private platformId: Object, private notificationsService: NotificationsService) {
    this.notificationsService.onOrderNotificationReceived().subscribe((notif :any)=> {
      this.notifsCount = this.notifications.unshift();
    });

  }

  ngOnInit() {

  

    if (isPlatformBrowser(this.platformId)) {


      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });    console.log("thisssss",this.currentUser);
  } else {
  }

  }


  logout(): void {
    this.authService.logout(); 
  }
  profile():void {
    this.router.navigate(['/pages/profile', this.currentUser?.userInfo._id]).then(() => {
      location.reload();
    });
}
}