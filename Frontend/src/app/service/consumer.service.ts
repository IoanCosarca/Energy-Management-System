import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MeasurementModel } from '../model/measurement.model';

@Injectable({
	providedIn: 'root'
})
export class ConsumerService {
	constructor(private httpClient: HttpClient) { }

	public getDeviceMessages(deviceID: number) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<MeasurementModel[]>(`http://localhost:8082/consumer/${deviceID}`, { headers });
	}
}
