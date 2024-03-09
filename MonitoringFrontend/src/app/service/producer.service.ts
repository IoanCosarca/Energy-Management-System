import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class ProducerService {

	constructor(private httpClient: HttpClient) { }

	public sendJsonMessage(deviceID: number) {
		return this.httpClient.get(`http://localhost:8083/producer/${deviceID}`);
	}
}
