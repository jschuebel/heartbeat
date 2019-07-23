import {Injectable} from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {WebSocketService} from './websocket.service';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

const CHAT_URL = 'ws://localhost:3005';
const DATA_URL = 'ws://localhost:3006';
const CHUNK_URL = 'ws://localhost:3007';

export interface Message {
	author: string,
	message: string,
	newDate?: string
}

@Injectable()
export class ChatService {
	public messages: Subject<Message>  = new Subject<Message>();
	public randomData: Subject<number> = new Subject<number>();
	//public chunkrequest: Subject<Buffer>;
	
	
  private websocket: any;
  public isOpened : boolean;
	public sendMessage(text:Message){
  console.log("Attempting send text chunk socket", text);
  	
    this.websocket.send(JSON.stringify(text));
  }

  public GetInstanceStatus(): Observable<any>{
		var reader = new FileReader();
		this.isOpened = false;
  console.log("Attempting create chunk socket");
     		this.websocket = new WebSocket(CHUNK_URL);
			 this.websocket.binaryType = "arraybuffer";
 
  console.log("after create chunk socket");
    this.websocket.onopen =  (evt : any) => {
          this.isOpened=true;
 console.log("chunk socket is open");
      };

		return Observable.fromEvent(this.websocket,'message');
	}	

	constructor(private wsService: WebSocketService) {

		// 1. subscribe to chatbox
		this.messages   = <Subject<Message>>this.wsService
			.connect(CHAT_URL)
			.map((response: MessageEvent): Message => {
				
				console.log("Back from map of chatservice messages");
				console.log(response);
				let data = JSON.parse(response.data);
				console.log("chatservice messages after json parse");
				return {
					author : data.author,
					message: data.message,
					newDate: data.newDate
				}
			});


		// 2. subscribe to random data
		this.randomData = <Subject<number>>this.wsService
			.connectData(DATA_URL)
			.map((response: any): number => {
				console.log("Back from map of chatservice randomData");
				return response.data;
			})

		/* 3. subscribe to chunk
		this.chunkrequest   = <Subject<Buffer>>this.wsService
			.connectChunk(CHUNK_URL)
			.map((response: any): Buffer => {
				return response.data;
			})
			*/
	}
} // end class ChatService