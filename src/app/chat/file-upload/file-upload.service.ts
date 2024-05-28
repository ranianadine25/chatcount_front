import { Injectable } from '@angular/core';
import { HttpClient,HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable, catchError, map, throwError } from 'rxjs';
interface UploadResponse {
  status: number; // Add status property
  message?: string; // Optional message property
  data?: any; 
  fecId?: string;// Optional data property
}
@Injectable({
  providedIn: 'root'
})
export class FecService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  getFecs(userId: string | null): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/fec/getCsv/${userId}`);
  }
  
  uploadFile(file: File, userId: string | null): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('csvFile', file);
  
    const headers = new HttpHeaders(); 
    headers.set('Content-Type', 'multipart/form-data'); 
  
    const options = {
      headers: headers
    };
  
    return this.http.post<UploadResponse>(`${this.apiUrl}/fec/uploadCsv/${userId}`, formData, options)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Gérer l'erreur HTTP ici
          return throwError(error); // Renvoie l'erreur au composant pour une gestion ultérieure
        })
      );
  }

  replaceFile(existingFecId: string, file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('csvFile', file);
  
    const headers = new HttpHeaders();
    headers.set('Content-Type', 'multipart/form-data');
  
    return this.http.put<UploadResponse>(`${this.apiUrl}/fec/replace/${existingFecId}`, formData, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Gérer l'erreur HTTP ici
          return throwError(error); // Renvoie l'erreur au composant pour une gestion ultérieure
        })
      );
  }
  
  
  ajoutConversation(userId: string, fecId: string, conversationName: string): Observable<any> {
    const body = { conversationName }; 
    return this.http.post<any>(`${this.apiUrl}/conversation/conversations/${userId}/${fecId}`, body)
  }
  deleteFec(fecId: string): Observable<UploadResponse> {
    return this.http.delete<UploadResponse>(`${this.apiUrl}/fec/deletefec/${fecId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error); 
        })
      );
  }
  createFolder(name: string, userId: string | undefined): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dossier/create`, { name, userId });
  }

  // Récupérer tous les dossiers d'un utilisateur
  getFolders(userId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dossier/${userId}`);
  }

  getFolderById(folderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dossier/folder/${folderId}`);
  }

  updateFolder(folderId: string, name: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/dossier/${folderId}`, { name });
  }

  // Supprimer un dossier
  deleteFolder(folderId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/dossier/${folderId}`);
  }
  uploadFiled(file: File, userId: string | null, folderId: string): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('csvFile', file);

    // Ne pas définir explicitement le type de contenu, laisser le navigateur gérer cela pour les requêtes FormData

    return this.http.post<UploadResponse>(`${this.apiUrl}/dossier/upload/${userId}/${folderId}`, formData)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          // Gérer l'erreur HTTP ici
          return throwError(error); // Renvoie l'erreur au composant pour une gestion ultérieure
        })
      );
  }
  getFecsd(userId: string | null,folderId: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dossier/${userId}/${folderId}/fec`);
  }
  getFecsByState(userId: string | null,folderId: string,state:string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/dossier/filter/${userId}/${folderId}/${state}`);
  }
  getFecName(conversationId: string): Observable<any>{
    return this.http.get<{ name: string }>(`${this.apiUrl}/dossier/getFecName/${conversationId}`).pipe(
      catchError(error => {
        console.error("Erreur lors de la récupération du nom du FEC :", error);
        return throwError("Erreur lors de la récupération du nom du FEC");
      })
    );
  }
  
  deleteFecd(fecId: string): Observable<UploadResponse> {
    return this.http.delete<UploadResponse>(`${this.apiUrl}/dossier/deleteFec/${fecId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(error); 
        })
      );
  }
  lancerTraitement(fecId: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/dossier/traiter/${fecId}`, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Une erreur est survenue lors du traitement du FEC :', error);
        return throwError('Une erreur est survenue lors du traitement du FEC');
      })
    );
  }
}