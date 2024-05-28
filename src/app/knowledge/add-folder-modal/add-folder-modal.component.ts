import { ChangeDetectorRef, Component, EventEmitter, Inject, Output, PLATFORM_ID } from '@angular/core';
import { User } from '../../authetification/login/model_user';
import { AuthService } from '../../authetification/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Fec } from '../../chat-div/conersation-model';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { AlertHandlerService } from '../../SharedModule/alert_handler.service';
import { FecService } from '../../chat/file-upload/file-upload.service';
import { ToastrService } from 'ngx-toastr';
import io from 'socket.io-client';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-folder-modal',
  templateUrl: './add-folder-modal.component.html',
  styleUrl: './add-folder-modal.component.css'
})
export class AddFolderModalComponent {
  fecs!: any[];
  selectedFec: Fec | undefined;
  public currentUser: User | null = null;
  conversationName: string = '';
  showPreviousComponent: boolean = false;
  private socket: any;
  isPopupOpen = false;
  isPopupOpen2 =false;
  private apiUrl = environment.apiUrl;
  folderName: string = '';
  constructor(
    public dialogRef: MatDialogRef<AddFolderModalComponent>,

    private router: Router,
    private alertServ: AlertHandlerService,
    private fecService: FecService,
    private authService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private dialog: MatDialog ,
    @Inject(MAT_DIALOG_DATA) public data: any

    
  ) {
    this.socket = io(environment.apiUrl);
      this.socket.on('connect_error', (error: any) => {
        console.error('Error connecting to socket:', error);
      });
  
      this.socket.on('error', (error: any) => {
        console.error('Error sending message:', error);
      });
  }


  ngOnInit(): void {

    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }

  }
  confirmReplace() {
    this.dialogRef.close(true);
  }

  cancelReplace() {
    this.dialogRef.close(false);
  }

closemodal(){
  var modal=document.getElementById("modal1");
  modal!.style.display = "none";
}

  
  
  confirmAction(){
    this.isPopupOpen = false;
    location.reload();
  }

  confirmAction2(){
    this.isPopupOpen2 = false;
    location.reload();


  }

  
  createFolder() {
    if (!this.folderName) {
      return;
    }
  
    const userId = this.currentUser?.userInfo._id;
  
    this.fecService.createFolder(this.folderName, userId).subscribe(
      (response) => {
        console.log('Dossier créé avec succès :', response);
    this.isPopupOpen2= true;
    location.reload();
      },
      
      (error: HttpErrorResponse) => {
        console.error("File upload error:", error);
        if (error.status === 409) {
          this.isPopupOpen = true;
          console.error('le nom de dossier existe déja!', error);

        } else {
          console.error('Erreur lors de la création du dossier :', error);
          this.alertServ.alertHandler("Une erreur inconnue s'est produite.", "error");

       }
          }
       ) }
    


 

 
closePopup(){
  this.dialogRef.close(true);
}
    



  
}
