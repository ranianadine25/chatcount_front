import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, Subject, catchError, throwError } from 'rxjs';
import io from 'socket.io-client';
import { environment } from '../environment/environment';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { Conversation } from '../chat-div/conersation-model';
import { User } from '../authetification/login/model_user';
import { AuthService } from '../authetification/auth.service';
import { map } from 'rxjs/operators'; // Importez les opérateurs map et catchError
interface MonthData {
  month: string;
  revenue: string;
  percentage: string;
}
export class Message {
  constructor(
    public sender: string | undefined,
    public text: string,
    public likes: number,
    public dislikes: number,
    public comments: string[] | null = null // Tableau pour stocker les commentaires
  ) {}
}


@Injectable()
export class ChatService {
  likes: number = 0; 
  dislikes: number = 0; 
  
   comments: string[] = [];
    public socket: any;
  conversation = new Subject<Message[]>();
  private fecName: string | undefined;

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private authService: AuthService, @Inject(PLATFORM_ID) private platformId: Object) {
    this.socket = io(environment.apiUrl);
      this.socket.on('connect_error', (error: any) => {
        console.error('Error connecting to socket:', error);
      });
  
      this.socket.on('error', (error: any) => {
        console.error('Error sending message:', error);
      });
  }

  getBotAnswer(msg: string, conversationId: string) {
    const userMessage = new Message('user', msg,0,0,[]);
    this.conversation.next([userMessage]);
    this.socket.emit('message', { text: msg, conversationId }); // Envoyer le message de l'utilisateur au backend
  }
  getFecName(conversationId: string): Observable<string> {
    return this.http.get<{ fecName: string }>(`${this.apiUrl}/fec/getFecName/${conversationId}`).pipe(
      map(response => response.fecName),
      catchError(error => {
        console.error("Erreur lors de la récupération du nom du FEC :", error);
        return throwError("Erreur lors de la récupération du nom du FEC");
      })
    );
  }
  getParaphrases(text: string): Observable<any>  {
    return this.http.post<any>(`${this.apiUrl}/conversation/paraphrases`, { text });
  }
 
  initSocketListeners(conversationId: string) {
    // Écouter l'événement 'fetchFecName' pour récupérer le nom FEC
    this.socket.emit('fetchFecName', conversationId);
    this.socket.on('updateLikesDislikes', (data: any) => {
      // Vérifiez si l'ID de la conversation correspond à celle en cours
      if (data.conversationId === conversationId) {
          // Mettez à jour les likes et dislikes dans votre composant Angular
          this.likes = data.likes;
          this.dislikes = data.dislikes;
          this.comments = data.comment;
          
      }
  });
  
  this.socket.on('message', (data: any) => {
    let botMessage: Message;
    if (typeof data.text === 'string') {
      botMessage = new Message(data.sender, data.text, data.likes, data.dislikes, data.comments);
    } else if (Array.isArray(data.text)) {
      let text = '';
      data.text.forEach((item: MonthData) => {
        text += `${item.month} | ${item.revenue} | ${item.percentage} ;\n`;
      });
      botMessage = new Message(data.sender, text, data.likes, data.dislikes, data.comments);
    } else {
      botMessage = new Message(data.sender, JSON.stringify(data.text), data.likes, data.dislikes, data.comments);
    }
    this.conversation.next([botMessage]);
  });
  
  
    this.socket.on('fecName', (fecName: string) => {
      this.fecName = fecName;
      console.log('FEC name:', fecName);
    });
  }
  async saveMessageToDatabase(
    sender: string,
    text: string | object | { month: string; revenue: string; percentage: string }[], // Modifiez le type de texte pour accepter une chaîne, un objet ou un tableau d'objets
    likes: number,
    dislikes: number,
    conversationId: string,
    comments: string[] // Tableau de commentaires
  ) {
    if (conversationId && conversationId.trim() !== '') {
      let textToSave = ''; 
  
      if (Array.isArray(text)) {
        textToSave = text.map((item: { month: string; revenue: string; percentage: string }) => {
          return `${item.month} | ${item.revenue} | ${item.percentage} ;`;
        }).join('\n');
      } else if (typeof text === 'object') {
        textToSave = JSON.stringify(text, null, 2); 
      } else {
        textToSave = text;
      }
  
      this.saveConversation([{ sender, text: textToSave, likes, dislikes, comments }], conversationId)
        .subscribe(
          (response) => {
            console.log("Message enregistré avec succès :", response);
            this.likes = likes;
            this.dislikes = dislikes;
            this.comments = comments;
          },
          (error) => {
            console.error("Erreur lors de l'enregistrement du message :", error);
          }
        );
    } else {
      console.error("ConversationId invalide :", conversationId);
    }
  }
  
  
  
  saveConversation(messages: Message[], conversationId: string): Observable<any> {
    const formattedMessages = messages.map((message: Message) => {
      if (typeof message.text === 'object') {
        message.text = JSON.stringify(message.text); 
      }
      return message;
    });
  
    const requestBody = { messages: formattedMessages }; 
    
    return this.http.post<any>(`${this.apiUrl}/conversation/enregistrer-message/${conversationId}`, requestBody)
      .pipe(
        catchError(this.handleError) 
      );
  }
  
  
  
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
    } else {
      const errorMessage = `Backend returned code ${error.status}, body was: ${error.error}`;
      return throwError(errorMessage);
    }
    return throwError('Something bad happened; please try again later.');
  }

  getConversations(userId : string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversation/conversations/${userId}`);
  }
  getSharedConversations(userId : string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversation/sharedconversations/${userId}`);
  }
  getConversationMessages(conversationId : string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/conversation/conversationsMessage/${conversationId}`);
  }
  deleteConversation(conversationId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/conversation/deleteconversation/${conversationId}`);
  }
  renameConversation(conversationId: string, newName: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/conversation/renameConversation/${conversationId}`, { name: newName });
  }
  inviteUsersToConversation(conversationId: string, userIds: string[]): Observable<any> {
    return this.http.post(`${this.apiUrl}/user/invite-users`, { conversationId, userIds });
  }
}
