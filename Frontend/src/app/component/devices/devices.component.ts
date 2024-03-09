import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { DeviceModel } from 'src/app/model/device.model';
import { IDModel } from 'src/app/model/id-response.model';
import { DeviceService } from 'src/app/service/device.service';
import { UserService } from 'src/app/service/user.service';

@Component({
	selector: 'app-devices',
	templateUrl: './devices.component.html',
	styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {
	isAdmin: boolean = false;

	dataSource: DeviceModel[] = [];

	displayedColumns: string[] = ['description', 'address', 'maxHourlyConsumption', 'userID', 'actions'];

	userColumns: string[] = ['description', 'address', 'maxHourlyConsumption', 'userID'];

	searchID: number = 0;

	hide: boolean = true;

	updateForm!: FormGroup;

	descriptionOfToBeUpdated: string = "";

	updateInformation: DeviceModel = {
		description: '',
		address: '',
		maxHourlyConsumption: 0,
		userID: 0
	}

	ids!: IDModel[];

	selectedID = 0;

	constructor(private fb: FormBuilder, private deviceService: DeviceService, private userService: UserService) { }

	searchForm: FormGroup = this.fb.group({
		searchInput: ['', []],
	});

	ngOnInit(): void {
		if (JSON.parse(sessionStorage.getItem('jwt') as string).role === "ADMIN") {
			this.isAdmin = true;
		}
		if (this.isAdmin === true) {
			this.deviceService.getDevices().subscribe(
				(devices: DeviceModel[]) => {
					this.dataSource = devices;
				},
				(error) => {
					console.error('Error fetching devices', error);
				}
			);
		}
		else {
			this.deviceService.getUserDevices(JSON.parse(sessionStorage.getItem('jwt') as string).id).subscribe(
				(devices: DeviceModel[]) => {
					this.dataSource = devices;
				},
				(error) => {
					console.error('Error fetching devices', error);
				}
			);
		}
	}

	getByID(): void {
		this.searchID = this.searchForm.get('searchInput')!.value;
		this.deviceService.getDeviceByID(this.searchID).subscribe(
			(device: DeviceModel) => {
				this.dataSource = [device];
				this.searchForm.reset();
			},
			(error) => {
				this.dataSource = [];
				console.error('Error fetching device', error);
			}
		);
	}

	getAll(): void {
		this.deviceService.getDevices().subscribe(
			(devices: DeviceModel[]) => {
				this.dataSource = devices;
			},
			(error) => {
				console.error('Error fetching devices', error);
			}
		);
	}

	updateDevice(device: DeviceModel): void {
		this.hide = false;
		this.updateForm = this.fb.group({
			newDescription: [device.description, []],
			newAddress: [device.address, []],
			newConsumption: [device.maxHourlyConsumption, []]
		});
		this.descriptionOfToBeUpdated = device.description;
		this.userService.getIDs().subscribe(
			(ids: IDModel[]) => {
				this.ids = ids;
			},
			(error) => {
				console.error('Error fetching ids', error);
			}
		);
	}

	onUpdate(): void {
		this.updateInformation.description = this.updateForm.get('newDescription')!.value;
		this.updateInformation.address = this.updateForm.get('newAddress')!.value;
		this.updateInformation.maxHourlyConsumption = this.updateForm.get('newConsumption')!.value;
		this.updateInformation.userID = this.selectedID;
		this.deviceService.updateDevice(this.descriptionOfToBeUpdated, this.updateInformation)
			.pipe(
				switchMap(() => this.deviceService.getDevices())
			)
			.subscribe(
				(users: DeviceModel[]) => {
					this.dataSource = users;
				},
				(error) => {
					console.error(error);
				}
			);
		this.hide = true;
	}

	deleteDevice(device: DeviceModel): void {
		this.deviceService
			.deleteDevice(device.description)
			.pipe(
				switchMap(() => this.deviceService.getDevices())
			)
			.subscribe((devices) => {
				this.dataSource = devices;
			});
	}
}
