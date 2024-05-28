import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root' // Assuming root-level service
})
export class ConversationService {

  private currentConversationId: string | null = null;
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}
  

  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  setCurrentConversationId(conversationId: string) {
    this.currentConversationId = conversationId;
  }

  clearMessageHistory() {
    const conversationId = this.currentConversationId;
    if (conversationId) {
      localStorage.removeItem(`messageHistory-${conversationId}`);
    }
  }

  startNewConversation(userId: string, fecId: string, conversationName: string): Observable<any> {
    const body = { conversationName }; 
    return this.http.post<any>(`${this.apiUrl}/conversation/conversations/${userId}/${fecId}`, body)
  
  }

  saveMessageHistory(conversationId: string, messages: string[]) {
    localStorage.setItem(`messageHistory-${conversationId}`, JSON.stringify(messages));
  }

  getMessageHistory(conversationId: string): string[] | null {
    const history = localStorage.getItem(`messageHistory-${conversationId}`);
    if (history) {
      return JSON.parse(history) as string[];
    } else {
      return null;
    }
  }
}
