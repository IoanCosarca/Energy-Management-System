import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ExceededMessageModel } from 'src/app/model/exceeded-message.model';

declare const Stomp: any;
declare const SockJS: any;

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
	isAdmin: boolean = false;

	url: string = 'http://localhost:8082/socket';

	client: any;

	message!: ExceededMessageModel;

	constructor(private router: Router, private toastr: ToastrService) { }

	ngOnInit(): void {
		if (JSON.parse(sessionStorage.getItem('jwt') as string).role === "ADMIN") {
			this.isAdmin = true;
		}
		this.connection();
	}

	connection(): void {
		let ws = new SockJS(this.url);
		this.client = Stomp.over(ws);

		this.client.connect({}, () => {
			this.client.subscribe("/topic", (m: any) => {
				this.message = JSON.parse(m.body);
				if (Number(JSON.parse(sessionStorage.getItem('jwt') as string).id) === this.message.userID) {
					this.toastr.warning("Warning!", this.message.deviceDescription + " exceeded its maximum hourly consumption!", {
						timeOut: 10000
					});
				}
			});
		});
	}

	accessHome(): void {
		this.router.navigate(['/Home']);
	}

	accessAccounts(): void {
		this.router.navigate(['/Accounts']);
	}

	accessDevices(): void {
		this.router.navigate(['/Devices']);
	}

	accessAddDevice(): void {
		this.router.navigate(['/CreateDevice']);
	}

	accessNotifications(): void {
		this.router.navigate(['/History']);
	}

	openChats(): void {
		this.router.navigate(['/Chat']);
	}

	logOut(): void {
		sessionStorage.removeItem('jwt');
		this.router.navigate(['/']);
	}
}
