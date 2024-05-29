import { Component, Output, EventEmitter, OnInit, HostListener } from '@angular/core';
import { navbarData } from './nav-data';
import { Router } from '@angular/router';

interface SideNavToggle {
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  constructor(private router: Router) {}

  showChatDiv(): boolean {
    return this.router.url.includes('chat');
  }

  showKnowledgeDiv(): boolean {
    return this.router.url.includes('knowledge');
  }

  navData = navbarData;

  ngOnInit(): void {}

  reloadPage(routeLink: string): void {
    let url = '/pages/' + routeLink;
    this.router.navigate([url]).then(() => {
      location.reload();
    });
  }
  
  
  

  private getParamsFromRoute(routeLink: string): any {
    const params: any = {};
    const matches = routeLink.match(/\/:([^/]+)/g);
    if (matches) {
      matches.forEach(match => {
        const paramName = match.substr(2);
        params[paramName] = ':id'; 
      });
    }
    return params;
  }
}
