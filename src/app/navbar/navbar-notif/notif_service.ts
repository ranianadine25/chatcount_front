import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { Observable } from 'rxjs';
import io from 'socket.io-client';


@Injectable({
    providedIn: 'root'
  })
  export class NotificationsService {
    public socket: any;

    constructor(private http: HttpClient) {
      this.socket = io(environment.apiUrl);
      this.socket.on('connect_error', (error: any) => {
        console.error('Error connecting to socket:', error);
      });
  
      this.socket.on('error', (error: any) => {
        console.error('Error sending message:', error);
      });
    }
    onOrderNotificationReceived() {
      return new Observable<Notification>(observer => {
        this.socket.on('onew-mission-notification', (notif: any) => {
          observer.next(notif);
        });
      });
    }
    getNotifications(): Observable<Notification[]> {
      return this.http.get<Notification[]>(`${environment.apiUrl}/notif/getNotifications`);
    }
    
    markNotificationAsRead(notificationId: string): Observable<any> {
      return this.http.put<any>(`/notif/markAsRead/${notificationId}`, {});
    }
  
    markAsRed (userId: string | undefined) {
      return this.http.put(environment.apiUrl + `/notif/markAsRead/${userId}`, {});
    }
  }
  