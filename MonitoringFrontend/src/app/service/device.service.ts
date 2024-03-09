import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { DeviceModel } from "../model/device.model";
import { IDModel } from "../model/id-response.model";

@Injectable({
	providedIn: 'root'
})
export class DeviceService {
	constructor(private httpClient: HttpClient) { }

	public getIDs() {
		return this.httpClient.get<IDModel[]>(`http://localhost:8081/device/ids`);
	}

	public getDeviceByID(id: number) {
		return this.httpClient.get<DeviceModel>(`http://localhost:8081/device/id/${id}`);
	}
}
