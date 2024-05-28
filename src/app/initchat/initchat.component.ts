import { Component } from '@angular/core';
import { AlertHandlerService } from '../SharedModule/alert_handler.service';
import { ChatService } from '../chat/chatbot.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NewchatComponent } from '../chat-div/modal/newchat/newchat.component';

@Component({
  selector: 'app-initchat',
  templateUrl: './initchat.component.html',
  styleUrl: './initchat.component.css'
})

export class InitchatComponent {
  showContent: boolean = true;

  constructor(
    private conversationService: ChatService,
    private alertServ:AlertHandlerService,

    private modal: NgbModal,
  ){}
  bots: any[] = []; 
  addChat() {
    const modalRef = this.modal.open(NewchatComponent, {
      size: 'md',
      windowClass: 'modal modal-primary'
    });
    modalRef.componentInstance.modalMode="add";

    modalRef.result.then(x=>{
      if(x){
        this.alertServ.alertHandler("Conversation lancée",'success');
        this.showContent = false;

      }
    },
    ()=>{

    })
  }
}
