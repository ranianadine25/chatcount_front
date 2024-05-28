import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { InitchatComponent } from './initchat.component';
import { SharedModule } from '../SharedModule/shared.module';
import { NewchatComponent } from '../chat-div/modal/newchat/newchat.component';
import { ChatDivComponent } from '../chat-div/chat-div.component';

const routes: Routes = [
  {
    path: '',
    component: InitchatComponent,
    data: { animation: 'chat' }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgbDropdownModule,
    NgbModule,  
    ToastrModule.forRoot(),



  ],
  declarations: [InitchatComponent,NewchatComponent],

  providers: [ //provideAnimations(), // required animations providers
  provideToastr(),],
    // Toastr providers
  
})
export class InitChatManagementModule { }
