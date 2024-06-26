import { Component, OnInit, PLATFORM_ID, Inject, ViewChild, ElementRef, NgModule, HostListener, ChangeDetectorRef } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { Subscription } from 'rxjs';
import { AuthService } from '../authetification/auth.service';
import { FecService } from '../chat/file-upload/file-upload.service';
import { ChatService } from '../chat/chatbot.service';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { User } from '../authetification/login/model_user';
import { ConversationService } from '../knowledge/conversation.service';
import { Conversation } from './conersation-model';
import { NewchatComponent } from './modal/newchat/newchat.component';
import { MatDialog } from '@angular/material/dialog';
import { InviteUsersComponent } from './invite-users/invite-users.component';

@Component({
  selector: 'app-chat-div', 
  templateUrl: './chat-div.component.html',
  styleUrls: ['./chat-div.component.css']
})
export class ChatDivComponent implements OnInit {
  conversations: any = [];
  sharedconversation :any = [];
  showOwnerConversations: boolean = true;
  showSharedConversations: boolean = false;
  private subscriptions = new Subscription();
  @ViewChild('conversationList') conversationList: ElementRef | undefined;

  public loadingData: boolean = false;
  public currentUser: User | null = null;
  @ViewChild('dropdown') dropdown: NgbDropdown | undefined;

  constructor(
    private cdr: ChangeDetectorRef,

    private conversationService: ChatService,
    private alertServ: AlertHandlerService,
    private modal: NgbModal,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private router: Router,
    private fecService: FecService,
    private historiqueService: ConversationService,
    private dialog: MatDialog ,

  ) {}



  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        console.log("tawa",this.currentUser?.userInfo._id);
        this.getConversations();
        this.getSharedConversations();

      });
    } else {
    }
  }
  toggleConversationType(isOwnerConversation: boolean): void {
    this.showOwnerConversations = isOwnerConversation;
    this.showSharedConversations = !isOwnerConversation;
  }

  openDropdown(event: MouseEvent, dropdown: NgbDropdown): void {
    event.stopPropagation();
  }

  closeDropdown(dropdown: NgbDropdown): void {
    dropdown.close();
  }
  get selectedConversations(): any[] {
    return this.showOwnerConversations ? this.conversations : this.sharedconversation;
  }
  getConversations(): void {
    const userId = this.currentUser?.userInfo._id;
    this.loadingData = true;
    this.subscriptions.add(
      this.conversationService.getConversations(userId!).subscribe(
        (response: any) => {
          if (response && response.conversations) {
            const allConversations = response.conversations;
            const lastTenConversations = allConversations.slice(-20).reverse();
            this.conversations = lastTenConversations.map((conv: any) => ({
              ...conv,
              showInviteUsers: false // Ajout de cette ligne pour gérer l'invitation des utilisateurs
            }));
          } else {
            this.conversations = [];
          }
        },
        (error) => {
          this.alertServ.alertHandler('Erreur lors de la récupération des conversations', 'error');
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }
  getSharedConversations(): void {
    const userId = this.currentUser?.userInfo._id;
    this.loadingData = true;
    this.subscriptions.add(
      this.conversationService.getSharedConversations(userId!).subscribe(
        (response: any) => {
          if (response && response.conversations) {
            const allConversations = response.conversations;
            const lastTenConversations = allConversations.slice(-20).reverse();
            this.sharedconversation = lastTenConversations.map((conv: any) => ({
              ...conv,
              showInviteUsers: false // Ajout de cette ligne pour gérer l'invitation des utilisateurs
            }));
          } else {
            this.sharedconversation = [];
          }
        },
        (error) => {
          this.alertServ.alertHandler('Erreur lors de la récupération des conversations', 'error');
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }
  loadConversationHistory(conversationId: string): void {
    this.router.navigate(['/pages/chat', conversationId]).then(() => {
      location.reload();
    });
  }
  
  onDeleteConversation(conversationId: string): void {
    this.conversationService.deleteConversation(conversationId).subscribe(
      () => {
        this.getConversations();
        location.reload();
        console.log('Conversation supprimée avec succès');
      },
      error => {
        console.error('Erreur lors de la suppression de la conversation :', error);
      }
    );
  }
  cancelRenaming(conversation: any): void {
    conversation.isRenaming = false;
    conversation.newName = ''; 
  }
  addChat() {
    const dialogRef = this.dialog.open(NewchatComponent, {
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  // addChat() {
  //   const userId = this.currentUser?.userInfo._id;
  //   const fecId = '65e5a437c9c96fac48007881';

  //   this.historiqueService.startNewConversation(userId!, fecId, "new_conversation").subscribe(
  //     (response) => {
  //       if (response && response.conversationId) {
  //         this.router.navigate(['/pages/chat', response.conversationId]);
  //         this.alertServ.alertHandler("Conversation lancée", 'success');
          
  //       } else {
  //         console.error('Error creating conversation: Invalid response');
  //         this.alertServ.alertHandler("Erreur lors de la création de la conversation", 'error');
  //         this.historiqueService.clearMessageHistory();

  //       }
  //     },
  //     (error) => {
  //       console.error('Error creating conversation:', error);
  //       this.alertServ.alertHandler("Erreur lors de la création de la conversation", 'error');
  //     }
  //   );
  // this.scrollToBottom();

  // }
  scrollToBottom(): void {
    try {
      this.conversationList!.nativeElement.scrollTop = this.conversationList!.nativeElement.scrollHeight;
    } catch(err) { }
  }

  startRenaming(conversation: any): void {
    conversation.isRenaming = true;
    conversation.newName = conversation.name; // Pré-remplir avec le nom actuel
    setTimeout(() => {
      const input = document.querySelector(`input[ng-reflect-model="${conversation.newName}"]`) as HTMLInputElement;
      if (input) {
        input.focus();
      }
    });
  }
  
  renameConversation(conversation: any): void {
    if (!conversation.newName || conversation.newName.trim() === '') {
      console.error('Le nouveau nom de la conversation ne peut pas être vide');
      return;
    }

    this.conversationService.renameConversation(conversation._id, conversation.newName).subscribe(
      () => {
        conversation.name = conversation.newName;
        conversation.isRenaming = false;
        conversation.showDropdown = false; // Cacher le menu déroulant après le renommage
        console.log('Conversation renommée avec succès');
        this.cdr.detectChanges();
      },
      error => {
        console.error('Erreur lors du renommage de la conversation :', error);
      }
    );
  }

  getFirstMessageText(conversation: Conversation): string {
    if (conversation.messages.length > 0) {
      const firstMessage = typeof conversation.messages[0].text === 'string' ? conversation.messages[0].text : '';
      const words = firstMessage.split(' '); // Divise le texte en mots en utilisant l'espace comme séparateur
      if (words.length >= 2) {
        return words.slice(0, 2).join(' '); // Prend les deux premiers mots et les joint avec un espace
      } else {
        return firstMessage;
      }
    } else {
      return conversation.name;
    }
  }
  
  
  toggleDropdown(conversation: any): void {
    conversation.showDropdown = !conversation.showDropdown;

  }
  
  toggleInviteUsers(conversation: any): void {
    conversation.showInviteUsers = !conversation.showInviteUsers;
    console.log(`Invitation popup for conversation ${conversation._id}: ${conversation.showInviteUsers}`);

  }
  stopPropagation(event: MouseEvent): void {
    event.stopPropagation();
  }

  getInviteUsers(conversationId: string): void {
    const dialogRef = this.dialog.open(InviteUsersComponent, {
      width: '400px', // ajustez la largeur selon vos besoins
      height: '100%',

      data: { conversationId } // passez l'ID de la conversation en tant que donnée
    });
    console.log(conversationId);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  
}
