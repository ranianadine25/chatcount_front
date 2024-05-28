import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environment/environment';
import { Observable, catchError } from 'rxjs';
import { User } from '../authetification/login/model_user';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
    private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getAllLabels(labelNumber: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/label/getAllLabels/${labelNumber}`);
  }
  
  getAllLabelsbyRE(rootId: string, label: string,labelNumber: number) {
    return this.http.get<any[]>(`${this.apiUrl}/label/searchAllLabels/${rootId}/${label}/${labelNumber}`);
  }

  

  addNewLabel(newLabelData: any, lastNumber: number, user: string) {
    const requestData = {
      ...newLabelData,
      user
    };
    return this.http.post<any>(`${this.apiUrl}/label/addLabel/${lastNumber}`, requestData);
  }
  

  updateLabel(labelId: string, updatedLabelData: any,lastnumber:number) {
    return this.http.patch<any>(`${this.apiUrl}/label/updateLabel/${labelId}/${lastnumber}`, updatedLabelData);
  }
  
  deletelabel(folderId: string,labelNumber:number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/label/deleteLabel/${folderId}/${labelNumber}`);
  }
  
  getCsvData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/mots/getCsvData`)
      .pipe(
        catchError(this.handleError) 
      );
  }
  getPatternsData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/patterns/getpatterns`)
      .pipe(
        catchError(this.handleError) 
      );
  }
  insertCsvData(newRow: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mots/insertCsv`, newRow)
      .pipe(
        catchError(this.handleError)
      );
  }
  insertPatternData(newRow: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/patterns/insertligne`, newRow)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }
  deleteCsvData(rowIndex: number, columnIndex: number): Observable<any> {
    const options = {
      body: { rowIndex, columnIndex } 
    };
    return this.http.delete<any>(`${this.apiUrl}/mots/deleteCsv`, options);
  }
  deletePatternData(rowIndex: number, columnIndex: number): Observable<any> {
    const options = {
      body: { rowIndex, columnIndex } 
    };
    return this.http.delete<any>(`${this.apiUrl}/patterns/deletePattern`, options);
  }
  
  updateCsvData(rowIndex: number, columnIndex: number, newValue: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/mots/updateCsv`, { rowIndex, columnIndex, newValue });
  }
  updatePatternData(rowIndex: number, columnIndex: number, newValue: string): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/patterns/updatePattern`, { rowIndex, columnIndex, newValue });
  }
  addColumn(newColumn: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/mots/addColumn`, { newColumn });
  }
  updateCsvDataColonne(newColumn: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/updateCsvDataColonne`, { newColumn });
  }
  uploadCsvFile(fileName: string): Observable<any> {
    const body = { fileName };

    return this.http.post<any>(`${this.apiUrl}/mots/addTabMotClets`, body);
  }
  uploadPatternFile(fileName: string): Observable<any> {
    const body = { fileName };

    return this.http.post<any>(`${this.apiUrl}/patterns/addPaterns`, body);
  }
  exportCSV(): void {
    this.http.get(`${this.apiUrl}/mots/export`, { responseType: 'blob' })
      .subscribe(blob => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'exportedData.csv');
        document.body.appendChild(link);
        link.click();
        const childNode = document.getElementById('childElement');
const parentNode = childNode!.parentNode;

console.log(parentNode); // Cela affichera l'élément parent dans la console

        link.parentNode!.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, error => {
        console.error('Erreur lors de l\'exportation des données CSV:', error);
      });
  }
}
