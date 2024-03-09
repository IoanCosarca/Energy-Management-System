import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DeviceModel } from 'src/app/model/device.model';
import { IDModel } from 'src/app/model/id-response.model';
import { DeviceService } from 'src/app/service/device.service';
import { ProducerService } from 'src/app/service/producer.service';

@Component({
	selector: 'app-monitor',
	templateUrl: './monitor.component.html',
	styleUrls: ['./monitor.component.css']
})
export class MonitorComponent implements OnInit {
	selectedID = 0;

	ids!: IDModel[];

	monitorForm = this.fb.group({
		description: ['']
	});

	constructor(private fb: FormBuilder, private deviceService: DeviceService, private producerService: ProducerService, private router: Router) { }

	ngOnInit(): void {
		this.deviceService.getIDs().subscribe(
			(ids: IDModel[]) => {
				this.ids = ids;
			},
			(error) => {
				console.error('Error fetching ids', error);
			}
		);
	}

	changeDescription(): void {
		this.deviceService.getDeviceByID(this.selectedID).subscribe(
			(device: DeviceModel) => {
				this.monitorForm.get('description')?.setValue(device.description);
			},
			(error) => {
				console.error('Error fetching device', error);
			}
		);
	}

	onMonitor(): void {
		this.producerService.sendJsonMessage(this.selectedID).subscribe();
		this.router.navigate(['/Measurements']);
	}
}
