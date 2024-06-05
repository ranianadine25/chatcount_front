import { ChangeDetectorRef, Component, Inject, NgZone, OnInit, PLATFORM_ID } from '@angular/core';
import { ChatService, Message } from './chatbot.service';
import { FecService } from './file-upload/file-upload.service';
import { ViewChild, ElementRef } from '@angular/core'; 
import { AuthService } from '../authetification/auth.service';
import { User } from '../authetification/login/model_user';
import { isPlatformBrowser } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewchatComponent } from '../chat-div/modal/newchat/newchat.component';
import { Subscription, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations'; 
import { FormControl } from '@angular/forms';
import { environment } from '../environment/environment.prod';
import { SettingsService } from '../settings/setting.service';

@Component({
  selector: 'app-chatbot',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(50px)' }),
        animate('300ms', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ChatComponent implements OnInit {
  @ViewChild('textInput') textInput!: ElementRef<HTMLInputElement>;
  showParaphrases: boolean = false;

  showContent = true;
  imgPrefix = environment.apiUrl + '/avatars/';
  messages: Message[] = [];
  value = '';
  showComments: boolean[] = []
  public noConversationId: boolean = false;
  recording = false; 
  public conversationExists: boolean = false;
  fecName :string | undefined;
  fecId : String | undefined;
  question: string = '';
  selectedParaphrase: any;

  currentUser: User | null = null;
  conversationSubscription: Subscription | undefined;
  conversationId!: string;
  selectedMessageId: string | null = null;
  showCommentInput: boolean[] = [];
  newComment: string[] = [];
  inputControl: FormControl = new FormControl('');
  paraphrases!: any[];
  selectBConvContent:string = '';
  feedbackType: 'like' | 'dislike' | 'comment' | null = null;
  showCommentInputForMessageId: string | null = null;
  @ViewChild('audioRecorder', {static: false}) audioRecorder!: ElementRef<HTMLAudioElement>; 
  showCommentModal: boolean = false;
  selectedMessage: any;
  constructor(
    public settingsService: SettingsService,
    public chatService: ChatService,
    private modal: NgbModal,
    public fecService: FecService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.authService.retrieveCurrentUserFromLocalStorage();
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    } else {
    }
    this.inputControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(() => {
        const inputValue = this.textInput.nativeElement.value;
        console.log('Valeur de l\'entrée:', inputValue);
        return this.chatService.getParaphrases(inputValue);
      })
    ).subscribe(paraphrases => {
      this.paraphrases = paraphrases;
      console.log('Paraphrases récupérées:', paraphrases);
      this.cdr.detectChanges();
    }, error => {
      console.error('Erreur lors de la récupération des paraphrases:', error);
    });
    
    this.getFecId();
  console.log("fecId",this.fecId);
    this.route.paramMap.subscribe(params => {
      this.conversationId = params.get('id') || '';
      this.chatService.initSocketListeners(this.conversationId);
this.getParaphrases();
     
    if (this.conversationId) {
      this.conversationExists = true; 
      this.loadConversationMessages(this.conversationId);
           
      this.chatService.getFecId(this.conversationId).subscribe(
        fecName => {
          console.log("Nom du FEC reçu :", fecName);
          this.fecId = fecName; // Mettez à jour la propriété fecName
        },
        error => {
          console.error("Erreur lors de la récupération du nom du FEC :", error);
        }
      );
      this.chatService.getFecName(this.conversationId).subscribe(
        fecName => {
          console.log("Nom du FEC reçu :", fecName);
          this.fecName = fecName; // Mettez à jour la propriété fecName
        },
        error => {
          console.error("Erreur lors de la récupération du nom du FEC :", error);
        }
      );
    } else {
      this.conversationExists = false; 
    }
     
    });
  
    this.chatService.conversation.subscribe((messages: Message[]) => {
      this.messages = [...this.messages, ...messages];
    });
   
  
    this.conversationSubscription = this.chatService.conversation.subscribe((messages: Message[]) => {
      this.messages = [];
      this.messages = [...messages];
    });
    this.messages.forEach(() => {
      this.newComment.push('');
    });
   // this.messages.forEach(() => this.showComments.push(false));

  }
  onInputChange() {
    if (this.value.trim() !== '') {

    this.chatService.getParaphrases(this.value).subscribe(paraphrases => {
      this.ngZone.run(() => {
        this.paraphrases = paraphrases;
        console.log(paraphrases)
      });
      console.log('Paraphrases récupérées:', paraphrases);
    }, error => {
      console.error('Erreur lors de la récupération des paraphrases:', error);
    });
    this.value = '';

  }  }
  
  bots: any[] = []; 
  getParaphrases() {
    if (this.value.trim() !== '') {
      this.chatService.getParaphrases(this.value).subscribe(data => {
        this.paraphrases = data.paraphrases;
        console.log("sawfa nabqa hou,a", this.paraphrases);
        this.cdr.detectChanges();
        this.showParaphrases = true;

      });
    } else {
      this.showParaphrases = false;
      this.paraphrases = [];
    }
  }
  ngOnDestroy() {
    if (this.conversationSubscription) {
      this.conversationSubscription.unsubscribe();
    }
  }
  selectParaphrase(paraphrase: any) {
    this.value = paraphrase.paraphrase; 
    this.showParaphrases = false; 
  }
  onKeyUp() {
    if (this.value.trim() === '') {
      this.showParaphrases = false; 
    } else {
      this.showParaphrases = true; 
    }
  }
  getFecId(): void {
    this.chatService.getFecId(this.conversationId).subscribe(
      fecId => {
        this.fecId = fecId;
        console.log("ID du FEC récupéré :", this.fecId);
      },
      error => {
        console.error("Erreur lors de la récupération de l'ID du FEC :", error);
      }
    );
  }
  toggleCommentInput(index: number) {
    if (this.showCommentInput[index] !== undefined) {
      this.showCommentInput[index] = !this.showCommentInput[index];
    } else {
      this.showCommentInput[index] = true;
    }

  
  
  }
  
  addChat() {
    this.showContent = false;

    const modalRef = this.modal.open(NewchatComponent, {
      size: 'md',
      windowClass: 'modal modal-primary'
    });
    modalRef.componentInstance.modalMode = 'add';

    modalRef.result.then((x) => {
      if (x) {
      this.messages = [];
      this.showContent = false;
      }
    }, () => {});
  }

  
  sendFeedback(type: 'like' | 'dislike' | 'comment', messageId: string) {
    this.feedbackType = type;
    this.selectedMessageId = messageId;
    // Vous pouvez mettre en œuvre la logique supplémentaire ici, comme l'affichage d'une boîte de dialogue pour le commentaire
  }
  submitFeedback(comment: string) {
    if (this.feedbackType && this.selectedMessageId) {
      // Envoyer le feedback au service
      // Vous pouvez appeler le service ici pour envoyer le feedback au serveur
      console.log('Feedback type:', this.feedbackType);
      console.log('Selected message ID:', this.selectedMessageId);
      console.log('Comment:', comment);
      // Réinitialiser les variables de feedback après envoi
      this.feedbackType = null;
      this.selectedMessageId = null;
    }
  }
  cancelFeedback() {
    // Réinitialiser les variables de feedback
    this.feedbackType = null;
    this.selectedMessageId = null;
  }

  sendMessage() {
    if (this.value.trim() !== '') {
      this.chatService.getBotAnswer(this.value, this.conversationId);
      
      console.log("currentUser",this.currentUser);
      console.log(this.value);
  
     
      this.value = '';  
      this.showParaphrases = false;  
      this.paraphrases = [];  
  
  }}
  loadConversationMessages(conversationId: string): void {
    this.messages = []; // Effacer les messages existants avant de charger les nouveaux
    this.chatService.getConversationMessages(conversationId).subscribe(
      messages => {
        this.messages = messages.map((message: Message) => {
          if (Array.isArray(message.text)) {
            const formattedText = message.text.map(item => `${item.month} | ${item.revenue} | ${item.percentage};`).join('\n');
            return { ...message, text: formattedText };
          } else if (typeof message.text === 'object') {
            const formattedText = JSON.stringify(message.text);
            return { ...message, text: formattedText };
          } else {
            return message;
          }
        });
      },
      error => {
      }
    );
  }
  
  
  startRecording() {
    if (!this.recording) {
      this.recording = true;
      navigator.mediaDevices.getUserMedia({ audio: true }) 
        .then(stream => {
          const mediaRecorder = new MediaRecorder(stream); 
          const chunks: BlobPart[] = []; 

          mediaRecorder.ondataavailable = (event) => {
            chunks.push(event.data); 
          };

          mediaRecorder.onstop = () => {
            this.recording = false;
            const audioBlob = new Blob(chunks, { type: 'audio/wav' }); 
            const audioUrl = URL.createObjectURL(audioBlob);

            if (this.audioRecorder) {
              this.audioRecorder.nativeElement.src = audioUrl; 
              this.audioRecorder.nativeElement.controls = true;
            }
          };

          mediaRecorder.start();
          
          setTimeout(() => {
            mediaRecorder.stop(); 
          }, 5000);
        })
        .catch(error => {
          console.error('Error accessing microphone:', error);
        });
    }
  }
  likeMessage(message: Message) {
    if (message.sender === 'bot') {
      message.likes++;
      console.log('Like ajouté au message :', message);
      this.updateLikesDislikes(message);

    }

  }
  
  dislikeMessage(message: Message) {
    if (message.sender === 'bot') {
      message.dislikes++;
      console.log('Dislike ajouté au message :', message);
      this.updateLikesDislikes(message);
      


    }
  }
  addComment(message: Message, newComment: string) {
    if (newComment && newComment.trim() !== '') {
      message.comments!.push(newComment); // Ajouter le nouveau commentaire au tableau des commentaires
  
      this.updateLikesDislikes(message);
  
      newComment = '';
    }
  }
  
  updateLikesDislikes(message: Message) {
    console.log('Envoi de la mise à jour des likes/dislikes pour le message :', message);
    this.chatService.socket.emit('updateLikesDislikes', { 
      conversationId: this.conversationId, 
      message,
      likes: message.likes, 
      dislikes: message.dislikes,
      comments: message.comments // Utiliser le tableau des commentaires ici
    });
    this.chatService.saveMessageToDatabase(
      message.sender!,
      Array.isArray(message.text) ? 
        message.text.map(item => `${item.month}: ${item.revenue}, ${item.percentage}`).join('\n') : 
        message.text,
      message.likes,
      message.dislikes,
      this.conversationId,
      message.comments!
    );
      }
  
  openCommentDialog(message: any) {
    this.selectedMessage = message;
    this.showCommentModal = true;
  }

  closeCommentModal() {
    this.showCommentModal = false;
  }
  toggleComments(index: number) {
    if (this.showComments[index] !== undefined) {
      this.showComments[index] = !this.showComments[index];
    } else {
      this.showComments[index] = true; // ou false selon votre cas d'utilisation
    }
    console.log('Affichage des commentaires pour le message ', index, ':', this.showComments[index]);
  }
  
  sendMessageFromButton() {
    this.sendMessage();
  }
  exportData(): void {
    this.settingsService.exportCSVFec(this.fecId);
  }
  
}
