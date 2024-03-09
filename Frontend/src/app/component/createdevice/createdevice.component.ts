import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceModel } from 'src/app/model/device.model';
import { IDModel } from 'src/app/model/id-response.model';
import { DeviceService } from 'src/app/service/device.service';
import { UserService } from 'src/app/service/user.service';

@Component({
	selector: 'app-createdevice',
	templateUrl: './createdevice.component.html',
	styleUrls: ['./createdevice.component.css']
})
export class CreateDeviceComponent implements OnInit {
	deviceModel: DeviceModel = {
		description: '',
		address: '',
		maxHourlyConsumption: 0,
		userID: 0
	}

	ids!: IDModel[];

	selectedID = 0;

	constructor(private fb: FormBuilder, private deviceService: DeviceService, private userService: UserService, private router: Router) { }

	ngOnInit(): void {
		this.userService.getIDs().subscribe(
			(ids: IDModel[]) => {
				this.ids = ids;
			},
			(error) => {
				console.error('Error fetching ids', error);
			}
		);
	}

	deviceForm: FormGroup = this.fb.group({
		description: ['', [Validators.required, Validators.pattern('[a-zA-Z0-9\-,.()ăĂâÂîÎșȘțȚ ]*')]],
		address: ['', [Validators.required, Validators.pattern('[a-zA-Z\-ăĂâÂîÎșȘțȚ ]*')]],
		consumption: ['', [Validators.required, Validators.pattern("^[0-9]*$")]]
	});

	onCreate(): void {
		if (!this.deviceForm.valid) {
			return;
		}
		else {
			this.deviceModel.description = this.deviceForm.get('description')!.value;
			this.deviceModel.address = this.deviceForm.get('address')!.value;
			this.deviceModel.maxHourlyConsumption = this.deviceForm.get('consumption')!.value;
			this.deviceModel.userID = this.selectedID;
			this.deviceService.saveDevice(this.deviceModel).subscribe(
				() => {
					this.router.navigate(['/Home']);
				},
				error => {
					console.error(error);
				}
			);
		}
	}
}
