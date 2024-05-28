import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChatComponent } from './chat.component';
import { SharedModule } from '../SharedModule/shared.module';
import { ChatService } from './chatbot.service';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NewchatComponent } from '../chat-div/modal/newchat/newchat.component';
import { ToastrModule, provideToastr } from 'ngx-toastr';
import { MatDialogModule } from '@angular/material/dialog'; 
import { ConfirmmodalComponentj } from '../chat-div/modal/confirmmodal/confirmmodal.component';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { MatSnackBarModule } from '@angular/material/snack-bar';

const routes: Routes = [
  {
    path: '',
    component: ChatComponent,
    data: { animation: 'chat/:id' }
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes),
    NgbDropdownModule,
    NgbModule,  
    MatDialogModule,



  ],
  declarations: [ChatComponent,FileUploadComponent,ConfirmmodalComponentj],
  providers: [ChatService, MatSnackBarModule,
 provideAnimations(), 
 provideToastr(),
],
  
})

export class ChatManagementModule { }
