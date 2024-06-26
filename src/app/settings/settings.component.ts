import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { SettingsService } from './setting.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbDropdown } from '@ng-bootstrap/ng-bootstrap';
import { FecService } from '../chat/file-upload/file-upload.service';
import { AuthService } from '../authetification/auth.service';
import { User } from '../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  fecSettingsButtonColor: string = '#2541b200';
  keywordsButtonColor: string = '#2541b200';
  SynonymeButtonColor: string = '#2541b200';

  patternsButtonColor: string = '#2541b200';
    labels: any[] = [];
    isEditingTitle: boolean[] = [];

  thresholdToShow = 10;
  labelNumbers: number[] = [1, 2, 3, 4, 5]; 
  labelNumber: number = 1;
showIcon :boolean=false;

  searchRootId: string = '';
  searchLabel: string = '';
  @ViewChild('dropdown') dropdown: NgbDropdown | undefined;
  showFECSettings: boolean = false;
  showKeywords: boolean = false;
  showPatterns: boolean = false;
  showSynonymes: boolean = false;

  isEditing: boolean[][] = [];
  newColumnName: string = '';
  patternsData: any;
  public currentUser: User | null = null;

  csvData: any; 
synonymeData: any;
  newLabelRootId: string = '';
  newLabelName: string = '';
  newRow: any;
  constructor(private settingsService: SettingsService,
    private _snackBar: MatSnackBar,
    private cdr: ChangeDetectorRef,
    private fecService: FecService,
    private authService: AuthService,

    @Inject(PLATFORM_ID) private platformId: Object,

  ) { }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
    this.getPatterns();

    this.getCsvData();
    this.getSynonymeData();
  }
  getPatterns(): void {
    console.log("enaaaaaaaaaaaaaaa");
    this.settingsService.getPatternsData()
      .subscribe(
        (data) => {
          this.patternsData = data;
          console.log('Patterns Data:', this.patternsData);
        },
        (error) => {
          console.error('Error fetching patterns:', error);
          // Handle error as per your need
        }
      );
  }
  getCsvData(): void {
    this.settingsService.getCsvData()
      .subscribe(data => {
        this.csvData = data;
        this.newRow = new Array(this.csvData?.titre.split(';').length).fill('');
        this.initializeEditingArray();

      });
  }
  getSynonymeData(): void {
    this.settingsService.getSynonymeData()
      .subscribe(data => {
        this.synonymeData = data;
        this.synonymeData.titreArray = this.synonymeData?.titre.split(';');
        this.newRow = new Array(this.synonymeData.titreArray.length).fill('');
        this.initializeEditingArrays();
      });
  }
  
  initializeEditingArrays(): void {
    // Initialisez le tableau isEditingTitle en fonction de la longueur de titreArray
    this.isEditingTitle = new Array(this.synonymeData.titreArray.length).fill(false);
  
    // Initialisez le tableau isEditing pour les cellules
    this.isEditing = this.synonymeData.contenu.map((row: { split: (arg0: string) => { (): any; new(): any; length: any; }; }) => 
      new Array(row.split(';').length).fill(false)
    );
  }
  
 
  initializeEditingArray(): void {
    this.isEditing = new Array(this.csvData?.contenu.length).fill(false).map(() => new Array(this.csvData?.titre.split(';').length).fill(false));
  }
  initializeEditingArrayS(): void {
    this.isEditing = new Array(this.synonymeData?.contenu.length).fill(false).map(() => new Array(this.synonymeData?.titre.split(';').length).fill(false));
  }

  toggleEdit(row: number, col: number): void {
    this.isEditing![row][col] = !this.isEditing![row][col];
  }

  insertRow(): void {
    this.settingsService.insertCsvData(this.newRow)
      .subscribe(() => {
console.log("nnnnnnnnnnnnnnnn");
this._snackBar.open('Vous avez ajouter le mot clés avec succès.', 'Fermer', {
  panelClass: ['redNoMatch'] ,

  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'top'
});
        this.getCsvData();
      });
  }
  insertSynonymeRow(): void {
    this.settingsService.insertSynonymeData(this.newRow)
      .subscribe(() => {
console.log("nnnnnnnnnnnnnnnn");
this._snackBar.open('Vous avez ajouter le mot clés avec succès.', 'Fermer', {
  panelClass: ['redNoMatch'] ,

  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'top'
});
        this.getSynonymeData();
      });
  }
  isFormValid(): boolean {
    return this.newRow.every((value:any) => value.trim() !== '');
  }
  insertRowPaatern(): void {
    this.settingsService.insertPatternData(this.newRow)
      .subscribe(() => {
console.log("nnnnnnnnnnnnnnnn");
this._snackBar.open('Vous avez ajouter le question avec succès.', 'Fermer', {
  panelClass: ['redNoMatch'] ,

  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'top'
});
        this.getPatterns();
      });
  }
  deleteCsvData(rowIndex: number, columnIndex: number): void {
    this.settingsService.deleteCsvData(rowIndex, columnIndex)
      .subscribe(
        response => {
          if (response && response.message) {
            console.log('Cellule supprimée avec succès:', response.message);
            this._snackBar.open('Cellule supprimée avec succès.', 'Fermer', {
              panelClass: ['redNoMatch'],
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          } else {
            console.log('Réponse de suppression invalide:', response);
          }
        },
        error => {
          console.error('Erreur lors de la suppression de la cellule:', error);
          this._snackBar.open('Erreur lors de la suppression de la cellule.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      );
}
deleteSynonymeData(rowIndex: number, columnIndex: number): void {
  this.settingsService.deleteSynonymeData(rowIndex, columnIndex)
    .subscribe(
      response => {
        if (response && response.message) {
          console.log('Cellule supprimée avec succès:', response.message);
          this._snackBar.open('Cellule supprimée avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          alert("Cellule supprimée avec succès.Merci d'actualiser la page!");
        } else {
          console.log('Réponse de suppression invalide:', response);
        }
      },
      error => {
        console.error('Erreur lors de la suppression de la cellule:', error);
        this._snackBar.open('Erreur lors de la suppression de la cellule.', 'Fermer', {
          panelClass: ['redNoMatch'],
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
}
deletePatternData(rowIndex: number, columnIndex: number): void {
  this.settingsService.deletePatternData(rowIndex, columnIndex)
    .subscribe(
      response => {
        if (response && response.message) {
          console.log('Cellule supprimée avec succès:', response.message);
          this._snackBar.open('Cellule supprimée avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        } else {
          console.log('Réponse de suppression invalide:', response);
        }
      },
      error => {
        console.error('Erreur lors de la suppression de la cellule:', error);
        this._snackBar.open('Erreur lors de la suppression de la cellule.', 'Fermer', {
          panelClass: ['redNoMatch'],
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
      }
    );
}

  updateCellValue(rowIndex: number, columnIndex: number, event: any): void {
    const newValue = event?.target?.value ?? '';
    this.settingsService.updateCsvData(rowIndex, columnIndex, newValue)
      .subscribe(
        response => {
          console.log('Cellule mise à jour avec succès :', response);
          this._snackBar.open('Cellule mise à jour avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error => {
          console.error('Erreur lors de la mise à jour de la cellule :', error);
          this._snackBar.open('Erreur lors de la mise à jour de la cellule.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      );
  }
  
  updateSynonymeValue(rowIndex: number, columnIndex: number, event: any): void {
    const newValue = event?.target?.value ?? '';
    this.settingsService.updateSynonymeData(rowIndex, columnIndex, newValue)
      .subscribe(
        response => {
          console.log('Cellule mise à jour avec succès :', response);
          this._snackBar.open('Cellule mise à jour avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error => {
          console.error('Erreur lors de la mise à jour de la cellule :', error);
          this._snackBar.open('Erreur lors de la mise à jour de la cellule.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      );
  }
  updatePatternValue(rowIndex: number, columnIndex: number, event: any): void {
    const newValue = event?.target?.value ?? '';
    this.settingsService.updatePatternData(rowIndex, columnIndex, newValue)
      .subscribe(
        response => {
          console.log('Cellule mise à jour avec succès :', response);
          this._snackBar.open('Cellule mise à jour avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error => {
          console.error('Erreur lors de la mise à jour de la cellule :', error);
          this._snackBar.open('Erreur lors de la mise à jour de la cellule.', 'Fermer', {
            panelClass: ['redNoMatch'] ,
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      );
  }
  addColumn(): void {
    if (this.newColumnName.trim() !== '') {
      this.settingsService.addColumn(this.newColumnName)
        .subscribe(
          response => {
            console.log('Nouvelle colonne ajoutée avec succès :', response);
            this._snackBar.open('Nouvelle colonne ajoutée avec succès.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error => {
            console.error('Erreur lors de l\'ajout de la colonne :', error);
            this._snackBar.open('Erreur lors de l\'ajout de la colonne.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        );
    } else {
      this._snackBar.open('Veuillez saisir un nom pour la nouvelle colonne.', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }
  addColumSynonymen(): void {
    if (this.newColumnName.trim() !== '') {
      this.settingsService.addColumnSnonyme(this.newColumnName)
        .subscribe(
          response => {
            console.log('Nouvelle colonne ajoutée avec succès :', response);
            this._snackBar.open('Nouvelle colonne ajoutée avec succès.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          },
          error => {
            console.error('Erreur lors de l\'ajout de la colonne :', error);
            this._snackBar.open('Erreur lors de l\'ajout de la colonne.', 'Fermer', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
          }
        );
    } else {
      this._snackBar.open('Veuillez saisir un nom pour la nouvelle colonne.', 'Fermer', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
    }
  }

  toggleFECSettings() {
    this.fecSettingsButtonColor = '#5876ec'; // Couleur bleue avec transparence
    this.keywordsButtonColor = '#2541b200';
    this.patternsButtonColor = '#2541b200';
    this.SynonymeButtonColor = '#2541b200';

    this.showFECSettings = true;
    this.showKeywords = false;
    this.showPatterns = false;
    this.showSynonymes = false;

    this.cdr.detectChanges();

  }

  toggleKeywords() {
    this.keywordsButtonColor = '#5876ec'; // Couleur bleue avec transparence
    this.fecSettingsButtonColor = '#2541b200';
    this.patternsButtonColor = '#2541b200';
    this.SynonymeButtonColor = '#2541b200';

    this.showFECSettings = false;
    this.showKeywords = true;
    this.showPatterns = false;
    this.showSynonymes = false;

    this.cdr.detectChanges();

  }
  toggleSynonyme() {
    this.SynonymeButtonColor = '#5876ec'; // Couleur bleue avec transparence
    this.keywordsButtonColor = '#2541b200'; // Couleur bleue avec transparence
    this.fecSettingsButtonColor = '#2541b200';
    this.patternsButtonColor = '#2541b200';
    this.showFECSettings = false;

        this.showSynonymes = true;

    this.showKeywords = false;
    this.showPatterns = false;
    this.cdr.detectChanges();

  }


  togglePatterns() {
    this.patternsButtonColor = '#5876ec'; // Couleur bleue avec transparence
    this.keywordsButtonColor = '#2541b200';
    this.fecSettingsButtonColor = '#2541b200';
    this.SynonymeButtonColor = '#2541b200';

    this.showFECSettings = false;
    this.showKeywords = false;
    this.showPatterns = true;
    this.showSynonymes = false;

    this.cdr.detectChanges();


  }
  toggleLabels(labelNumber: number) {
    this.labelNumber = labelNumber;
    this.searchLabels();
    this.getAllLabels(labelNumber);
  }

  searchLabels() {
    // Appel de votre méthode de service pour rechercher les libellés avec les critères de recherche
    this.settingsService.getAllLabelsbyRE(this.searchRootId, this.searchLabel, this.labelNumber).subscribe((labels) => {
      this.labels = labels;
    });
  }



  getAllLabels(labelNumber: number): void {
    this.settingsService.getAllLabels(labelNumber)
      .subscribe(
        (response) => {
          this.labels = response;
          this.cdr.detectChanges();

        },
        (error) => {
          console.error('Erreur lors de la récupération des libellés :', error);
          // Gérer l'erreur dans votre application
        }
      );
  }
  
 
 
  addNewLabel(lastNumber: number) {
    if (!this.newLabelRootId || !this.newLabelName) {
      this._snackBar.open('Veuillez saisir la racine et le nom du libellé.', 'Fermer', {
        panelClass: ['redNoMatch'],
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top'
      });
      return;
    }

    const newLabelData = {
      rootId: this.newLabelRootId,
      label: this.newLabelName
    };

    this.settingsService.addNewLabel(newLabelData, lastNumber,this.currentUser?.userInfo._id!)
      .subscribe(
        (response) => {
          console.log('Libellé ajouté avec succès :', response.message);
          this._snackBar.open('Libellé ajouté avec succès!', 'Ok', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          // Mettez à jour les libellés après l'ajout du nouveau
          this.getAllLabels(1);
        },
        (error: HttpErrorResponse) => {
          console.error("Erreur lors de l'ajout du libellé :", error);
          if (error.status === 409) {
            this._snackBar.open('Le libellé existe déjà!', 'Fermer', {
              panelClass: ['redNoMatch'],
              duration: 5000,
            });
          } else {
            this._snackBar.open('Une erreur inconnue s"est produite.', 'Fermer', {
              panelClass: ['redNoMatch'],
              duration: 5000,
            });
          }
        }
      );
  }
  
  updateLabel(labelId: string, newLabelName: string, labelNumber: number): void {
    const updatedLabelData = {
      label: newLabelName
    };
  
    this.settingsService.updateLabel(labelId, updatedLabelData, labelNumber)
      .subscribe(
        (response) => {
          console.log('Libellé mis à jour avec succès :', response.message);
          this._snackBar.open('Libellé mis à jour avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        (error) => {
          console.error('Erreur lors de la mise à jour du libellé :', error);
        }
      );
  }
 
  onDeleteLabel(conversationId: string): void {
    this.settingsService.deletelabel(conversationId,this.labelNumber).subscribe(
      () => {
        this.getAllLabels(this.labelNumber);
        this.cdr.detectChanges();
        this._snackBar.open('Libellé supprimé avec succès.', 'Fermer', {
          panelClass: ['redNoMatch'],
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top'
        });
        console.log('Libellé supprimé avec succès');
      },
      error => {
        console.error('Erreur lors de la suppression du libellé :', error);
      }
    );
  }
  openFileUploadDialog(fileType: 'csvData' | 'synonymes') {
    const fileUploadDialog = document.createElement("input");
    fileUploadDialog.type = "file";
    fileUploadDialog.accept = ".csv";
    fileUploadDialog.addEventListener("change", event => {
      if (event.target) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          this.handleFileUpload(file, fileType);
        } else {
          console.warn("No file selected.");
        }
      }
    });
    fileUploadDialog.click();
  }
  handleFileUpload(file: File, fileType: 'csvData' | 'synonymes') {
    if (fileType === 'csvData') {
      this.fecService.uploadFile(file, this.currentUser?.userInfo._id!).subscribe(
        (response: any) => {
          console.log("Response:", response);
          if (response.status === 200) {
            this.settingsService.uploadCsvFile(file.name).subscribe(
              (response: any) => {
                console.log("CSV data imported successfully:", response);
                alert("Vous avez importé votre fichier avec succès.Merci d'actualiser la page!");

              },
              (error: any) => {
                console.error("Error importing CSV data:", error);
              }
            );
            console.log("upload fec avec succes");
          }
          if (response && response.message && response.fecId) {
            if (response.message === "Un fichier avec le même nom existe déjà.") {
              console.log("Fichier déjà existant:", response.message);
              this.settingsService.uploadCsvFile(file.name).subscribe(
                (response: any) => {
                  console.log("CSV data imported successfully:", response);
                },
                (error: any) => {
                  console.error("Error importing CSV data:", error);
                }
              );
              this.replaceFile(response.fecId, file);
            }
          } else {
            console.warn("Réponse invalide:", response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error("File upload error:", error);
          if (error.status === 409) {
            console.log("Fichier déjà existant:", error.error.message);
            this.replaceFile(error.error.fecId, file);
            this._snackBar.open('Le fichier existe déjà! Voulez-vous le remplacer?', 'Ok', {
              panelClass: ['redNoMatch'],
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            alert("Vous avez importé votre fichier avec succès.Merci d'actualiser la page!");

            this.settingsService.uploadCsvFile(file.name).subscribe(
              (response: any) => {
                console.log("CSV data imported successfully:", response);
              },
              (error: any) => {
                console.error("Error importing CSV data:", error);
              }
            );
            this.cdr.detectChanges();
          } else if (error.status === 300) {
            this._snackBar.open('Vous avez importé votre fichier avec succès.', 'Fermer', {
              panelClass: ['redNoMatch'],
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            alert("Vous avez importé votre fichier avec succès.Merci d'actualiser la page!");

            this.settingsService.uploadCsvFile(file.name).subscribe(
              (response: any) => {
                console.log("CSV data imported successfully:", response);
              },
              (error: any) => {
                console.error("Error importing CSV data:", error);
              }
            );
            this.cdr.detectChanges();
          } else {
            if (error.error && error.error.message) {
              console.error(error.error.message);
            } else {
              console.error("Unknown error occurred.");
            }
          }
        }
      );
    } else if (fileType === 'synonymes') {
      this.fecService.uploadFile(file, this.currentUser?.userInfo._id!).subscribe(
        (response: any) => {
          console.log("Response:", response);
          if (response.status === 200) {
            this.settingsService.uploadSynonymeFile(file.name).subscribe(
              (response: any) => {
                console.log("Synonymes imported successfully:", response);
                alert("Vous avez importé votre fichier avec succès.Merci d'actualiser la page!");

              },
              (error: any) => {
                console.error("Error importing synonymes:", error);
              }
            );
            console.log("upload synonymes avec succes");
          }
          if (response && response.message && response.synId) {
            if (response.message === "Un fichier avec le même nom existe déjà.") {
              console.log("Fichier déjà existant:", response.message);
              this.settingsService.uploadSynonymeFile(file.name).subscribe(
                (response: any) => {
                  console.log("Synonymes imported successfully:", response);
                  alert("Vous avez importé votre fichier avec succès.Merci d'actualiser la page!");

                },
                (error: any) => {
                  console.error("Error importing synonymes:", error);
                }
              );
              this.replaceFile(response.synId, file);
            }
          } else {
            console.warn("Réponse invalide:", response);
          }
        },
        (error: HttpErrorResponse) => {
          console.error("File upload error:", error);
          if (error.status === 409) {
            console.log("Fichier déjà existant:", error.error.message);
            this.replaceFile(error.error.synId, file);
            this._snackBar.open('Le fichier existe déjà! Voulez-vous le remplacer?', 'Ok', {
              panelClass: ['redNoMatch'],
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            alert("Vous avez importé votre fichier avec succès.");

            this.settingsService.uploadSynonymeFile(file.name).subscribe(
              (response: any) => {
                console.log("Synonymes imported successfully:", response);
              },
              (error: any) => {
                console.error("Error importing synonymes:", error);
              }
            );
            this.cdr.detectChanges();
          } else if (error.status === 300) {
            this._snackBar.open('Vous avez importé votre fichier avec succès.', 'Fermer', {
              panelClass: ['redNoMatch'],
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'top'
            });
            this.settingsService.uploadSynonymeFile(file.name).subscribe(
              (response: any) => {
                console.log("Synonymes imported successfully:", response);
                alert("Vous avez importé votre fichier avec succès.Merci d'actualiser la page!");

              },
              (error: any) => {
                console.error("Error importing synonymes:", error);
              }
            );
            this.cdr.detectChanges();
          } else {
            if (error.error && error.error.message) {
              console.error(error.error.message);
            } else {
              console.error("Unknown error occurred.");
            }
          }
        }
      );
    }
  }
  
  
  replaceFile(existingFecId: string, file: File) {
    this.fecService.replaceFile(existingFecId, file).subscribe(
      response => {
        this.settingsService.uploadCsvFile(file.name);
        this.cdr.detectChanges();

      },
      error => {
        console.error("Erreur lors du remplacement du fichier :", error);
       
      }
    );
  }
  
  exportData(): void {
    this.settingsService.exportCSV();
  }
  exportDataPattern(): void {
    this.settingsService.exportPatterns();
  }
  exportDataSynonym(): void {
    this.settingsService.exportSynonymes();
  }
  openFileUploadDialog2() {
    const fileUploadDialog = document.createElement("input");
    fileUploadDialog.type = "file";
    fileUploadDialog.accept = ".csv";
    fileUploadDialog.addEventListener("change", event => {
      if (event.target) {
        const fileInput = event.target as HTMLInputElement;
        if (fileInput.files && fileInput.files.length > 0) {
          const file = fileInput.files[0];
          this.handleFileUpload2(file);
        } else {
          console.warn("No file selected.");
        }
      }
    });
    fileUploadDialog.click();
  }
  handleFileUpload2(file: File) {
    if (file.name !== "questions.csv") {
      alert("Le fichier importé doit avoir le nom questions.csv.Merci d'actualiser la page!");
      return; 
    }
  
    this.fecService.uploadFile(file,this.currentUser?.userInfo._id!).subscribe(
      (response: any) => {
        
        console.log("Response:", response);
  if(response.status === 200){
    this.settingsService.uploadPatternFile(file.name).subscribe(
      (response: any) => {
        console.log("CSV data imported successfully:", response);
      },
      (error: any) => {
        console.error("Error importing CSV data:", error);
      }
    );console.log("upload fec avec succes");
  }
        if (response && response.message && response.fecId) {
          if (response.message === "Un fichier avec le même nom existe déjà.") {
            console.log("Fichier déjà existant:", response.message);
            this.settingsService.uploadPatternFile(file.name).subscribe(
              (response: any) => {
                console.log("CSV data imported successfully:", response);
              },
              (error: any) => {
                console.error("Error importing CSV data:", error);
              }
            )
            this.replaceFile2(response.fecId,file);

          } else {

           
          }
        } else {
          console.warn("Réponse invalide:", response);
        }
      },
      (error: HttpErrorResponse) => {
        console.error("File upload error:", error); // Log l'erreur
  
        if (error.status === 409) {
          console.log("Fichier déjà existant:", error.error.message);
          this.replaceFile2( error.error.fecId,file);
          this._snackBar.open('Le fichier existe déja! Voulez vous le remplacer? ', 'Ok', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.settingsService.uploadPatternFile(file.name).subscribe(
            (response: any) => {
              console.log("CSV data imported successfully:", response);
            },
            (error: any) => {
              console.error("Error importing CSV data:", error);
            }
          );
                    this.cdr.detectChanges();

        } else 
        if (error.status === 300) {
          this._snackBar.open('Vous avez importé votre fichier avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
          this.settingsService.uploadPatternFile(file.name).subscribe(
            (response: any) => {
              console.log("CSV data imported successfully:", response);
            },
            (error: any) => {
              console.error("Error importing CSV data:", error);
            }
          );
          this.cdr.detectChanges();

        }
        else {
          if (error.error && error.error.message) {
          
          } else {
          
          }
        }
      }
    );

  }
  
  replaceFile2(existingFecId: string, file: File) {
    this.fecService.replaceFile(existingFecId, file).subscribe(
      response => {
        this.settingsService.uploadPatternFile(file.name);
        this.cdr.detectChanges();

      },
      error => {
        console.error("Erreur lors du remplacement du fichier :", error);
       
      }
    );
  }
  toggleTitleEdit(index: number): void {
    this.isEditingTitle[index] = !this.isEditingTitle[index];
  }

  // Méthode pour mettre à jour la valeur du titre de colonne
  updateTitleValue(index: number, event: any): void {
    const newValue = event?.target?.value ?? '';
    this.synonymeData.titreArray[index] = newValue;
    this.synonymeData.titre = this.synonymeData.titreArray.join(';');

    // Appelez le service pour mettre à jour le titre dans le backend
    this.settingsService.updateTitleData(index, newValue)
      .subscribe(
        response => {
          console.log('Titre mis à jour avec succès :', response);
          this._snackBar.open('Titre mis à jour avec succès.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        },
        error => {
          console.error('Erreur lors de la mise à jour du titre :', error);
          this._snackBar.open('Erreur lors de la mise à jour du titre.', 'Fermer', {
            panelClass: ['redNoMatch'],
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          });
        }
      );
  }

}
