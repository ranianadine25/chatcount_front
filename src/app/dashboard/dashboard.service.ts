import { Injectable } from '@angular/core';
import { Observable, timestamp } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { Message, MessageSocketEvent } from './message-model';
interface BotResponseData {
    text: string;
    // Ajoutez d'autres propriétés si nécessaire
}
interface ChatListResponse {
    // Définir la structure des données retournées par votre API
    // Par exemple :
    userId: string;
    chats: Chat[];
  }
  
  // Définir le type Chat si nécessaire
  interface Chat {
    // Définir la structure des données d'une conversation
    // Par exemple :
    conversationId: string;
    lastMessage: string;
    unreadCount: number;
    // Ajoutez d'autres propriétés au besoin
  }
@Injectable()
export class ChatService {
	constructor(private socket: Socket) {}
     currentTimestamp = Date.now();
      date = new Date(this.currentTimestamp);

	sendMessage(message: string): void {
		this.socket.emit('user-message', message);
	}

	// Méthode pour recevoir les réponses du bot
    // receiveBotResponses(): Observable<Message> {
    //     return new Observable(observer => {
    //         this.socket.on('bot-response', (data: BotResponseData) => { // Spécifiez le type des données reçues du socket
    //             const botResponse: Message = new Message('bot', data.text,this.date); // Créez une instance de Message à partir des données reçues du bot
    //             observer.next(botResponse); // Envoyez la réponse du bot à l'observateur
    //         });

    //         return () => {
    //             this.socket.disconnect();
    //         };
    //     });
    // }


	// Méthode pour récupérer la liste des conversations
	getChatList(userId: string ): Observable<ChatListResponse> {
		if (userId !== null) {
			this.socket.emit('chat-list', { userId: userId });
		}
		return new Observable(observer => {
			this.socket.on('chat-list-response', (data: ChatListResponse) => {
				observer.next(data);
			});
			return () => {
				this.socket.disconnect();
			};
		});
	}

	// Méthode pour émettre l'événement add-message
	sendMessageEvent(message: MessageSocketEvent): void {
		this.socket.emit('add-message', message);
	}

	// Méthode pour recevoir l'événement add-message-response
	receiveMessages(): Observable<MessageSocketEvent> {
        return new Observable(observer => {
            this.socket.on('add-message-response', (data: MessageSocketEvent) => {
                observer.next(data);
            });
    
            return () => {
                this.socket.disconnect();
            };
        });
    }
    
}
