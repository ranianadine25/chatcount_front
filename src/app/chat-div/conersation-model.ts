import { User } from "../authetification/login/model_user";

export interface Message {
    sender: string | undefined;
    text: string | undefined;
    timestamp: Date;
  }


  export interface Conversation {
    _id: string;
    date: Date;
    name: string;
    messages: Message[]; 
    __v: number;
    
  }
  

  export interface Fec {
  name:string;
  data: string;
  }
  export class ConvList {
    list: Conversation[] = [];
    documentsCount = {
        count: 0
    }
}