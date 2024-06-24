import { ChangeDetectorRef, Component, Inject, Input, PLATFORM_ID } from '@angular/core';
import {  ElementRef, ViewChild  } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

import { AuthService } from '../../authetification/auth.service';
import { ChatService } from '../../chat/chatbot.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../authetification/login/model_user';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrl: './invite-users.component.css'
})
export class InviteUsersComponent {
  @Input() conversationId!: string;
  users: any[] = [];
  selectedUsers: string[] = [];
  public currentUser: User | null = null;

  constructor(     private cdr: ChangeDetectorRef,
    public dialogRef: MatDialogRef<InviteUsersComponent>,  @Inject(MAT_DIALOG_DATA) public data: { conversationId: string },
    private conversationService:ChatService,   @Inject(PLATFORM_ID) private platformId: Object, private authService: AuthService) {
      this.conversationId = data.conversationId;

    }

  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        console.log("tawa",this.currentUser?.userInfo._id);

      });
    } else {
    }
    this.loadUsers();
    console.log(this.users)
    console.log("userrrrrrrrs",this.users);

  }

  loadUsers() {
    this.authService.getInvitedUsers(this.currentUser?.userInfo._id!).subscribe(

      users => {
        this.users = users;
        this.cdr.detectChanges(); 

        console.log(this.users);
      },
      error => {
        console.error('Error loading users:', error);
      }
    );
  }
  toggleUserSelection(userId: string): void {
    const index = this.selectedUsers.indexOf(userId);
    console.log(userId)
    if (index !== -1) {
      this.selectedUsers.splice(index, 1);
    } else {
      this.selectedUsers.push(userId);
    }
    this.inviteUsers();
    console.log('conersationId:', this.conversationId); // Vérifie si la sélection fonctionne correctement

    console.log('Selected users:', this.selectedUsers); // Vérifie si la sélection fonctionne correctement
  }

  inviteUsers(): void {
    if (this.conversationId && this.selectedUsers.length > 0) {
      const userIds = [...this.selectedUsers];
      if (this.currentUser?.userInfo._id) {
        userIds.push(this.currentUser.userInfo._id);
      }
      this.conversationService.inviteUsersToConversation(this.conversationId, userIds).subscribe(
        response => {
          alert("Utilisateur invité avec succès!")
          console.log('Users invited successfully:', response);
        },
        error => {
          console.error('Error inviting users:', error);
        }
      );
    }
  }
   
  onNoClick(): void {
    this.dialogRef.close();
  }
  closePopup(){
    this.dialogRef.close(true);
  }
     
}