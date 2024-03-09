import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceModel } from '../model/device.model';
import { IDModel } from '../model/id-response.model';

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	constructor(private httpClient: HttpClient) { }

	public getDevices() {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<DeviceModel[]>(`http://localhost:8081/device`, { headers });
	}

	public getUserDevicesIDs(userID: number) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<IDModel[]>(`http://localhost:8081/device/ids/${userID}`, { headers });
	}

	public getUserDevices(userID: number) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<DeviceModel[]>(`http://localhost:8081/device/user/${userID}`, { headers });
	}

	public getDeviceByID(id: number) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<DeviceModel>(`http://localhost:8081/device/id/${id}`, { headers });
	}

	public saveDevice(deviceData: DeviceModel) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.post<DeviceModel>(`http://localhost:8081/device`, deviceData, { headers });
	}

	public updateDevice(description: string, newDeviceData: DeviceModel) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.put(`http://localhost:8081/device/${description}`, newDeviceData, { headers });
	}

	public deleteDevice(description: string) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.delete(`http://localhost:8081/device/description/${description}`, { headers });
	}

	public deleteMapToUser(userID: number) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.delete(`http://localhost:8081/device/userID/${userID}`, { headers });
	}
}
