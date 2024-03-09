import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageModel } from '../model/message.model';

@Injectable({
	providedIn: 'root'
})
export class ChatService {
	constructor(private httpClient: HttpClient) { }

	public getMessagesBySender(sender: number) {
		return this.httpClient.get<MessageModel[]>(`http://localhost:8084/chat/${sender}`);
	}
}
