import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations';

import { HttpClientModule, HttpClient, withFetch, provideHttpClient } from '@angular/common/http';

import { AppComponent } from './app.component';

import { ToastrModule } from 'ngx-toastr';
import { SharedModule } from './SharedModule/shared.module';

import { RouterModule, Routes } from '@angular/router';
import { ChatService } from './chat/chatbot.service';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';
const appRoutes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full',
  },
  {
    path: 'pages',
    loadChildren: () => import('./main-layout/pages.module').then(m => m.AppRoutingModule),
  },
  

  {
    path: 'auth',
    loadChildren: () => import('./authetification/login/auth.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'invitation',
    loadChildren: () => import('./verify-invitation/verif-invitaion.module').then(m => m.VerifInvitationModule),
  },
  {
    path: '**',
    redirectTo: 'auth/login', // Redirige les routes non définies vers la page de connexion ou une page 404
  },
  
];

@NgModule({
  declarations: [
    AppComponent,
    
    
   
    
  ],
  imports: [
    BrowserModule,

BrowserAnimationsModule,
    HttpClientModule,
    SharedModule,
    
    RouterModule.forRoot(appRoutes, {
      scrollPositionRestoration: 'enabled', // Add options right here
      
    }),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    })
  ],
  providers: [
    provideClientHydration(),
    provideHttpClient(withFetch()),
    ChatService,
    {provide: LocationStrategy , useClass: HashLocationStrategy}

  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  
 }
