import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { map } from 'rxjs/operators';
import { User } from './login/model_user';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private signUpUrl = environment.apiUrl;
  private loginUrl = environment.apiUrl;

  private currentUserSubject = new BehaviorSubject<User | null>(null);
    currentUser$ = this.currentUserSubject.asObservable();
  constructor(private http: HttpClient, private router: Router) {

  }
  setUser(user: User) {
    this.currentUserSubject.next(user);
  }
  public get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  signUp(formData: FormData): Observable<any> {
    // Include image data in the request body
    return this.http.post<any>(`${this.signUpUrl}/user/signup`, formData, { reportProgress: true, observe: 'events' });
  }
 
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/user/login`, { email, password })
      .pipe(
        map((user) => {
          if (user && user.token) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.currentUserSubject.next(user);
            console.log('Avatar de l\'utilisateur connecté : ', user.userInfo.avatar);
          }
          return user;
        })
      );
  }
  updateProfile(formData: FormData, userId: string): Observable<any> {
    return this.http.post<any>(`${this.loginUrl}/user/updateprofil/${userId}`, formData, {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    });
  }
  retrieveCurrentUserFromLocalStorage(): void {
    const currentUserString = localStorage.getItem('currentUser');
    if (currentUserString) {
      const currentUser: User = JSON.parse(currentUserString);
      this.currentUserSubject.next(currentUser);
    }
  }
  
  
  logout(): void {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.router.navigate(['/auth/login']);
  }
  updateAvatar(formData: FormData, userID: string): Observable<any> {
    return this.http.post<any>(`${this.signUpUrl}/user/updateavatar/${userID}`, formData, { reportProgress: true, observe: 'events' });
  }
  generateInvitationLink(email: string, inviterId: string): Observable<any> {
    return this.http.post(`${environment.apiUrl}/user/invite`, { email, inviterId });
  }

  verifyInvitationToken(token: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/verify-invitation`, { params: new HttpParams().set('token', token) });
  }
  getInvitedUsers(inviterId: string): Observable<any> {
    return this.http.get(`${environment.apiUrl}/user/getInvitedUser/${inviterId}`);
  }
}
