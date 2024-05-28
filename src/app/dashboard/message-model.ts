export class Message {
    sender: string;
    text: string;
    timestamp: Date;
    conversationId: string; 


    constructor(sender: string, text: string, timestamp: Date, conversationId: string) {
        this.sender = sender;
        this.text = text;
        this.timestamp = timestamp;
        this.conversationId = conversationId;
    }
}
export class MessageSocketEvent {
    sender: string;
    text: string;
    conversationId: string;

    constructor(sender: string, text: string, conversationId: string) {
        this.sender = sender;
        this.text = text;
        this.conversationId = conversationId;
    }
}
