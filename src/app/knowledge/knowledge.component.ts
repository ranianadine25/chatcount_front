import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { knowledgeService } from './knowledge.service';
import { Message } from '../dashboard/message-model';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { FecService } from '../chat/file-upload/file-upload.service';
import { AuthService } from '../authetification/auth.service';
import { ToastrService } from 'ngx-toastr';
import { User } from '../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, Subscription, takeUntil } from 'rxjs';

interface ChatListResponse {
  userId: string;
}


@Component({
  selector: 'app-knowledge',
  templateUrl: './knowledge.component.html',
  styleUrl: './knowledge.component.css',

})

export class KnowledgeComponent implements OnInit {
  fecs!: any[];
  folderId!: string;
  public missionListSize: number = 0;
  private searchSubject = new Subject<string>();
  private unsubscribe$ = new Subject<void>();
  private subscriptions = new Subscription();
  value: string = ''; 
  entries: any;

  public currentUser: User | null = null;
  folderName :string | undefined;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private knowledgeService : knowledgeService,
    private router: Router,
    private alertServ: AlertHandlerService,
    private fecService: FecService,
    private authService: AuthService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object,
    private chatService: knowledgeService) {}

    ngOnInit() {
      if (isPlatformBrowser(this.platformId)) {
        this.authService.retrieveCurrentUserFromLocalStorage();
        this.subscriptions.add(this.authService.currentUser$.subscribe(user => {
          this.currentUser = user;
          console.log("Current User ID:", this.currentUser?.userInfo._id);
        }));
    
        this.route.paramMap.subscribe(params => {
          this.folderId = params.get('id') || '';
          console.log("folderId", this.folderId);
          if (this.folderId) {
            this.subscriptions.add(this.fecService.getFecName(this.folderId).subscribe(
              response => {
                console.log("Folder name response:", response);
                this.folderName = response.folder.name;
              },
              error => {
                console.error("Error retrieving folder name:", error);
              }
            ));
          }
          this.searchSubject.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.getFecs();
          });
          this.getFecs();
        });
      }
    
    

   
  
   
   // this.
  }
  // fetchComptableEntries(): void {
  //   const codeDossier = '12345';
  //   const filter = 'datePiece>2024-01-01 AND compteNumero:411';

  //   this.knowledgeService.getComptableEntries(codeDossier, filter).subscribe({
  //     next: (data) => {
  //       this.entries = data;
  //     },
  //     error: (error) => {
  //       this.errorMessage = 'Erreur lors de la récupération des écritures comptables';
  //       console.error(error);
  //     }
  //   });
  // }
  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  connectToFECSoftware(){

  }
  handleFileUpload(file: File) {
    this.fecService.uploadFiled(file,this.currentUser?.userInfo._id!,this.folderId).subscribe(
      (response: any) => {
        
        console.log("Response:", response);
  if(response.status === 200){
    //this.isPopupOpen2 = true;
    this.fecs = this.fecs.filter(fec => fec._id !== response._id);
location.reload();
console.log("upload fec avec succes");
  }
        if (response && response.message && response.fecId) {
          if (response.message === "Un fichier avec le même nom existe déjà.") {
            console.log("Fichier déjà existant:", response.message);
            this.replaceFile(response.fecId,file);

          } else {
            this.alertServ.alertHandler(
              response.message,
              "success"
            );
            this.toastr.success(response.message, 'Succès',
              {
                positionClass: 'toast-bottom-right',
                toastClass: 'toast ngx-toastr',
                closeButton: true
              });
          }
        } else {
          console.warn("Réponse invalide:", response);
        }
      },
      (error: HttpErrorResponse) => {
        console.error("File upload error:", error); // Log l'erreur
  
        if (error.status === 409) {
          console.log("Fichier déjà existant:", error.error.message);
          this.replaceFile( error.error.fecId,file);
          this.alertServ.alertHandler('Un fichier avec le même nom existe déjà dans ce dossier.Voulez vous le remplacer?.', 'success');

          this._snackBar.open('Un fichier avec le même nom existe déjà dans ce dossier.Voulez vous le remplacer?', 'Ok', {
            panelClass: ['redNoMatch'] ,

            duration: 5000, 
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else 
        if (error.status === 300) {
          this.getFecs();
          this.fecs = this.fecs.filter(fec => fec._id !== error.error.fecId);
          location.reload();
          this.alertServ.alertHandler('Fichier uploadé et traité avec succès!.', 'success');

          this._snackBar.open('Fichier uploadé et traité avec succès!.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            horizontalPosition: 'center',
            verticalPosition: 'top',
            duration: 7000 // 7 secondes
          });
          
        }
        else {
          if (error.error && error.error.message) {
            this._snackBar.open('Une erreur inconnue s"est produite lors du chargement du fichier.', 'Fermer', {
              
              panelClass: ['redNoMatch'] ,

              duration: 5000, 
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.alertServ.alertHandler(
              error.error.message,
              "error"
            );
          } else {
            
            this.alertServ.alertHandler(
              "Une erreur inconnue s'est produite lors du chargement du fichier.",
              "error"
            );
          }
        }
      }
    );
    console.log("rrrrrrrrrrrrrrrrrrrrrrrrrrrr",this.currentUser?.userInfo._id);

  }
  

  
  replaceFile(existingFecId: string, file: File) {
    this.fecService.replaceFile(existingFecId, file).subscribe(
      response => {
        this.alertServ.alertHandler(
          response.message!,
          "success"
        );
        this.toastr.success(response.message, 'Succès',
          {
            positionClass: 'toast-bottom-right',
            toastClass: 'toast ngx-toastr',
            closeButton: true
          });
      },
      error => {
        console.error("Erreur lors du remplacement du fichier :", error);
        this.alertServ.alertHandler(
          "Une erreur est survenue lors du remplacement du fichier",
          "error"
        );
      }
    );
  }
  

  openFileUploadDialog() {
    const fileUploadDialog = document.createElement("input");
    fileUploadDialog.type = "file";
    fileUploadDialog.accept = ".csv";
    fileUploadDialog.addEventListener("change", event => {
      if (event.target) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          this.handleFileUpload(file);
        } else {
          console.warn("No file selected.");
        }
      }
    });
    fileUploadDialog.click();
    fileUploadDialog.onerror = (error) => {
      console.error("Error opening file upload dialog:", error);
    };
  }
  
  getFecs(): void {
    this.fecService.getFecsd(this.currentUser?.userInfo._id!, this.folderId).subscribe(
      response => {
        console.log("Réponse de la récupération des FEC :", response);
        
        if (response.fecs) {
          this.fecs = response.fecs;

          this.cdr.detectChanges(); 
        } else {
          console.warn("Aucun FEC trouvé dans la réponse.");
        }
      },
      error => {
        console.error("Une erreur est survenue lors de la récupération des FEC :", error);
      }
    );
  }
  getColor(etat: string): string {
    switch (etat) {
      case 'non traité':
        return 'bg-info'; // Fond jaune (warning)
      case 'traité':
        return 'bg-success'; // Fond vert (success)
      default:
        return ''; // Fond transparent par défaut
    }
}
editFec(fecId: string){

}
deleteFec(fecId: string){
  this.subscriptions.add(
    this.fecService.deleteFecd(fecId).subscribe(x => {
      this.getFecs();
      location.reload();

    }, error => {
      console.log(error)
      this.alertServ.alertHandler("Erreur lors de la suppression de la mission", 'error');
    }
    )
  )
}
lancerTraitementFEC(fecId: string) {
  this.fecService.lancerTraitement(fecId).subscribe(
    response => {
      console.log('Traitement du FEC réussi :', response);
      this._snackBar.open('Traitement du fichier a terminé avec succès.', 'Fermer', {
              
        panelClass: ['redNoMatch'] ,

        duration: 5000, 
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    },
    error => {
      console.error('Erreur lors du traitement du FEC :', error);
      this._snackBar.open('Une erreur inconnue s"est produite lors du traitement du fichier.', 'Fermer', {
              
        panelClass: ['redNoMatch'] ,

        duration: 5000, 
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });    }
  );
}
getFecsByState(userId: string, folderId: string, state: string) {
  this.fecService.getFecsByState(userId, folderId, state).subscribe(
    response => {
      console.log("FECs filtrés par état :", response);
      this.fecs = response.fecs
      this.cdr.detectChanges(); 
    },
    error => {
      console.error("Erreur lors de la récupération des FECs par état :", error);
    }
  );
}
filterFecsByState(event: any) {
  const selectedValue = event.target.value;
  if (selectedValue === "") {
    this.getFecs(); 
  } else {
    this.getFecsByState(this.currentUser?.userInfo._id!, this.folderId, selectedValue);
  }
}




}