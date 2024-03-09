import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageModel } from '../model/message.model';

@Injectable({
	providedIn: 'root'
})
export class ConsumerService {

	constructor(private httpClient: HttpClient) { }

	public getMessages() {
		return this.httpClient.get<MessageModel[]>(`http://localhost:8082/consumer`);
	}

	public deleteMessage(timestamp: Date) {
		const jsDate = new Date(timestamp);
		const formattedTimestamp = this.formatTimestampForBackend(jsDate);
		return this.httpClient.delete(`http://localhost:8082/consumer/${formattedTimestamp}`);
	}
	
	private formatTimestampForBackend(timestamp: Date): string {
		const year = timestamp.getUTCFullYear();
		const month = (timestamp.getUTCMonth() + 1).toString().padStart(2, '0');
		const day = timestamp.getUTCDate().toString().padStart(2, '0');
		const hours = timestamp.getUTCHours().toString().padStart(2, '0');
		const minutes = timestamp.getUTCMinutes().toString().padStart(2, '0');
		const seconds = timestamp.getUTCSeconds().toString().padStart(2, '0');
		const milliseconds = timestamp.getUTCMilliseconds().toString().padStart(3, '0');
	
		return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}`;
	}
}
