import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { NgbDropdown, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertHandlerService } from '../../SharedModule/alert_handler.service';
import { MatDialog } from '@angular/material/dialog';
import { NewchatComponent } from '../../chat-div/modal/newchat/newchat.component';
import { AddFolderModalComponent } from '../add-folder-modal/add-folder-modal.component';
import { Subscription } from 'rxjs';
import { User } from '../../authetification/login/model_user';
import { AuthService } from '../../authetification/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { FecService } from '../../chat/file-upload/file-upload.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-document-div',
  templateUrl: './document-div.component.html',
  styleUrl: './document-div.component.css'
})
export class DocumentDivComponent {
  private subscriptions = new Subscription();
  folders: any = [];
  @ViewChild('dropdown') dropdown: NgbDropdown | undefined;

  public loadingData: boolean = false;
  public currentUser: User | null = null;
  constructor(
    private fecService: FecService,
    private router: Router,

    private alertServ: AlertHandlerService,
    private modal: NgbModal,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog ,

  ) {}
  
  ngOnInit(): void {
    
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
        console.log("tawa",this.currentUser?.userInfo._id);
        this.getFolders();

      });
    } else {
    }
  }
  addChat() {
    const dialogRef = this.dialog.open(AddFolderModalComponent, {
      width: '100%',
      height: '100%'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
  getFolders(): void {
    const userId = this.currentUser?.userInfo._id;

    this.loadingData = true;
    this.subscriptions.add(
      this.fecService.getFolders(userId!).subscribe(
        (response: any) => {
          if (response && response.folders) {
            console.log("fema folders");
            const allConversations = response.folders;
            const lastTenConversations = allConversations.slice(-20).reverse();
            this.folders = lastTenConversations;
          } else {
            this.folders = [];
          }
        },
        (error) => {
          this.alertServ.alertHandler("Erreur lors de la récupération des conversations", 'error');
        },
        () => {
          this.loadingData = false;
        }
      )
    );
  }
  loadConversationHistory(docId: string): void {
    this.router.navigate(['/pages/knowledge', docId]).then(() => {
      location.reload();
    });
  }
  onDeleteFolder(conversationId: string): void {
    this.fecService.deleteFolder(conversationId).subscribe(
      () => {
        this.getFolders();
        location.reload();
        console.log('Conversation supprimée avec succès');
      },
      error => {
        console.error('Erreur lors de la suppression de la conversation :', error);
      }
    );
  }
  toggleDropdown(folder: any): void {
    folder.showDropdown = !folder.showDropdown;

  }
  openDropdown(event: MouseEvent, dropdown: NgbDropdown): void {
    event.stopPropagation();
  }

  closeDropdown(dropdown: NgbDropdown): void {
    dropdown.close();
  }

}
