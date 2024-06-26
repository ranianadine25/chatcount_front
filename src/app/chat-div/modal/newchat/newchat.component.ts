import { Component, ElementRef, Inject, PLATFORM_ID, ViewChild, ChangeDetectorRef  } from '@angular/core';
import { ChatService } from '../../../chat/chatbot.service';
import { AlertHandlerService } from '../../../SharedModule/alert_handler.service';
import { FecService } from '../../../chat/file-upload/file-upload.service';
import { AuthService } from '../../../authetification/auth.service';
import { isPlatformBrowser } from '@angular/common';
import { User } from '../../../authetification/login/model_user';
import { ToastrService } from 'ngx-toastr';
import { NavigationExtras, Router } from '@angular/router'; // Importer le Router
import { MAT_DIALOG_DATA, MatDialog ,MatDialogRef} from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import io from 'socket.io-client';
import { Fec } from '../../../chat/file-upload/fec-model';
import { ConfirmmodalComponentj } from '../confirmmodal/confirmmodal.component';

interface UploadResponse {
  message: string;
  data: any; // Utilisez le type approprié pour vos données
  fecId: string; // Ou le type approprié pour l'identifiant FEC
}

@Component({
  selector: 'app-newchat',
  templateUrl: './newchat.component.html',
  styleUrl: './newchat.component.css'
})
export class NewchatComponent {
  fecs!: any[];
  selectedFec: Fec | undefined;
  public currentUser: User | null = null;
  conversationName: string = '';
  showPreviousComponent: boolean = false;
  private socket: any;
  isPopupOpen = false;
  isPopupOpen2 =false;
  private apiUrl = environment.apiUrl;

  constructor(
    public dialogRef: MatDialogRef<NewchatComponent>,

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
    this.getFecs();

  }
  confirmReplace() {
    this.dialogRef.close(true);
  }

  cancelReplace() {
    this.dialogRef.close(false);
  }
  getFecs(): void {
    this.fecService.getFecsTrait(this.currentUser?.userInfo._id!).subscribe(
      response => {
        this.fecs = response.data;
        this.cdr.detectChanges(); 
      },
      error => {
        this.alertServ.alertHandler(
          "Une erreur est survenue lors de la récupération des FEC",
          "error"
        );

        console.error(
          "Une erreur est survenue lors de la récupération des FEC :",
          error
        );
      }
    );
    console.log("ttttttttttttttttttttttt",this.currentUser?.userInfo._id);
  }
closemodal(){
  var modal=document.getElementById("modal1");
  modal!.style.display = "none";
}

  
  
  confirmAction(){
    this.isPopupOpen = false;
  }

  confirmAction2(){
    this.isPopupOpen2 = false;
  }

  
  

  launchDiscussion() {
    if (this.selectedFec && this.currentUser) {
        this.fecService.ajoutConversation(this.currentUser.userInfo._id, this.selectedFec!._id,"new conversation")
            .subscribe(
                (response) => {
                  
                    console.log(response);
                 
                    // Naviguer vers la nouvelle page et effacer l'historique de navigation
               
                      this.router.navigate(['/pages/chat', response.conversationId]).then(() => {
                        location.reload();
                      });
                      this.socket.emit("launch_success", { fecName: this.selectedFec!.name, conversationId: response.conversationId });
                      console.log("Selected FEC:", this.selectedFec);
console.log("Selected FEC name:", this.selectedFec!.name);
this.dialogRef.close(true);
this.isPopupOpen = false;

                },
                (error) => {
                    console.error("Erreur lors de l'ajout de la conversation :", error); // Log l'erreur
                    this.alertServ.alertHandler("Erreur lors de l'ajout de la conversation :", "error");
                }
            );
    } else {
        console.error("Veuillez sélectionner un FEC et un utilisateur.");
        this.alertServ.alertHandler("Veuillez sélectionner un FEC et un utilisateur", "error");
    }
}
closePopup(){
  this.dialogRef.close(true);
}
    
deleteFec(fecId: string): void {
  this.fecService.deleteFec(fecId).subscribe({
    next: () => {
      this.fecs = this.fecs.filter(fec => fec._id !== fecId);
      console.log('fec supprimé avec succès');
    },
    error: error => {
      console.error('Erreur lors de la suppression du fec :', error);
    }
  });
}


  
}
