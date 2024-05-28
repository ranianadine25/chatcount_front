import { Component, HostBinding, HostListener, OnDestroy, OnInit } from '@angular/core';
import { User } from '../authetification/login/model_user';
import { environment } from '../environment/environment';
import { Subject, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../authetification/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-dashboard',
  
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Use styleUrls instead of styleUrl
})
export class DashboardComponent implements OnInit {
  public    currentSkin:string = "white";
  
  currentRoot: string = 'root1'; // Default to the first root
      
  selectRoot(root: string): void {
    this.currentRoot = root;
  }
  public currentUser: User | null = null;
  imgPrefix = environment.apiUrl + '/avatars/';
  public coreConfig: any;
  public isFixed = false;
  public windowScrolled = false;
  private unsubscribeAll: Subject<void> = new Subject<void>(); // Simplified subscription management

  constructor(
    private router: Router,
    private authService: AuthService,
    private modal: NgbModal
  ) {}
  ngOnInit(): void {
    
  }
  


  logout(): void {
    this.authService.logout();
  }

  // HostListener for scroll behavior
  @HostListener('window:scroll', [])
  onWindowScroll(): void {
    const isNavbarStaticTop = this.coreConfig.layout.navbar.type === 'navbar-static-top';
    const isHorizontalLayout = this.coreConfig.layout.type === 'horizontal';
    const isPageScrolled = window.pageYOffset > 100 || document.documentElement.scrollTop > 100 || document.body.scrollTop > 100;
    
    this.windowScrolled = isPageScrolled && isNavbarStaticTop && isHorizontalLayout;
  }
}
