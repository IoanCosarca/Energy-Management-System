import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { MessageModel } from 'src/app/model/message.model';
import { ConsumerService } from 'src/app/service/consumer.service';

@Component({
	selector: 'app-measurements',
	templateUrl: './measurements.component.html',
	styleUrls: ['./measurements.component.css']
})
export class MeasurementsComponent implements OnInit {
	dataSource: MessageModel[] = [];

	displayedColumns: string[] = ['timestamp', 'deviceID', 'measurement', 'delete'];

	constructor(private consumerService: ConsumerService, private router: Router) { }

	ngOnInit(): void {
		this.consumerService.getMessages().subscribe(
			(messages: MessageModel[]) => {
				this.dataSource = messages;
			},
			(error) => {
				console.error('Error fetching messages', error);
			}
		)
	}

	goBack(): void {
		this.router.navigate(['/']);
	}

	deleteMessage(message: MessageModel): void {
		this.consumerService
			.deleteMessage(message.timestamp)
			.pipe(
				switchMap(() => this.consumerService.getMessages())
			)
			.subscribe((messages) => {
				this.dataSource = messages;
			});
	}
}
