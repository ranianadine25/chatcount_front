import { Component, Inject, Input, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../../authetification/auth.service';
import { ChatService } from '../../chat/chatbot.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../authetification/login/model_user';

@Component({
  selector: 'app-invite-users',
  templateUrl: './invite-users.component.html',
  styleUrls: ['./invite-users.component.css']
})
export class InviteUsersComponent implements OnInit {
  @Input() conversationId!: string;
  users: any[] = [];
  selectedUsers: string[] = [];
  public currentUser: User | null = null;

  constructor(private conversationService: ChatService, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {  
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.authService.getInvitedUsers(this.currentUser?.userInfo._id!).subscribe(
      users => {
        this.users = users;
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
    console.log('Selected users:', this.selectedUsers); // Vérifie si la sélection fonctionne correctement
  }

  inviteUsers(): void {
    if (this.conversationId && this.selectedUsers.length > 0) {
      this.conversationService.inviteUsersToConversation(this.conversationId, this.selectedUsers).subscribe(
        response => {
          console.log('Users invited successfully:', response);
        },
        error => {
          console.error('Error inviting users:', error);
        }
      );
    } else {
      console.error('No users selected.'); // Indique s'il n'y a aucun utilisateur sélectionné
    }
  }  
}
