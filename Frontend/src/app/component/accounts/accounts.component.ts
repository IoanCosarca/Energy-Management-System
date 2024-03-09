import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { switchMap } from 'rxjs';
import { UserRegisterModel } from 'src/app/model/user-register.model';
import { UserModel } from 'src/app/model/user.model';
import { DeviceService } from 'src/app/service/device.service';
import { UserService } from 'src/app/service/user.service';

@Component({
	selector: 'app-accounts',
	templateUrl: './accounts.component.html',
	styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
	dataSource: UserModel[] = [];

	displayedColumns: string[] = ['name', 'role', 'email', 'password', 'actions'];

	searchID: number = 0;

	searchEmail: string = "";

	hide: boolean = true;

	updateForm!: FormGroup;

	emailOfToBeUpdated: string = "";

	deletedID: number = 0;

	updateInformation: UserRegisterModel = {
		name: '',
		email: '',
		password: ''
	}

	constructor(private fb: FormBuilder, private userService: UserService, private deviceService: DeviceService) { }

	searchForm: FormGroup = this.fb.group({
		searchInput: ['', []],
	});

	ngOnInit(): void {
		this.userService.getUsers().subscribe(
			(users: UserModel[]) => {
				this.dataSource = users;
			},
			(error) => {
				console.error('Error fetching users', error);
			}
		);
	}

	getByID(): void {
		this.searchID = this.searchForm.get('searchInput')!.value;
		this.userService.getUserByID(this.searchID).subscribe(
			(user: UserModel) => {
				this.dataSource = [user];
				this.searchForm.reset();
			},
			(error) => {
				this.dataSource = [];
				console.error('Error fetching user', error);
			}
		);
	}

	getByEamil(): void {
		this.searchEmail = this.searchForm.get('searchInput')!.value;
		this.userService.getUserByEmail(this.searchEmail).subscribe(
			(user: UserModel) => {
				this.dataSource = [user];
				this.searchForm.reset();
			},
			(error) => {
				this.dataSource = [];
				console.error('Error fetching user', error);
			}
		);
	}

	getAll(): void {
		this.userService.getUsers().subscribe(
			(users: UserModel[]) => {
				this.dataSource = users;
			},
			(error) => {
				console.error('Error fetching users', error);
			}
		);
	}

	updateAccount(account: UserModel): void {
		if (this.hide == true) {
			this.hide = false;
			this.updateForm = this.fb.group({
				newName: [account.name, []],
				newEmail: [account.email, []],
				newPassword: ['', []]
			});
			this.emailOfToBeUpdated = account.email;
		}
		else {
			this.hide = true;
		}
	}

	onUpdate(): void {
		this.updateInformation.name = this.updateForm.get('newName')!.value;
		this.updateInformation.email = this.updateForm.get('newEmail')!.value;
		this.updateInformation.password = this.updateForm.get('newPassword')!.value;
		this.userService.updateUser(this.emailOfToBeUpdated, this.updateInformation)
			.pipe(
				switchMap(() => this.userService.getUsers())
			)
			.subscribe(
				(users: UserModel[]) => {
					this.dataSource = users;
				},
				(error) => {
					console.error(error);
				}
			);
	}

	deleteAccount(account: UserModel): void {
		this.userService
			.deleteUser(account.email)
			.pipe(
				switchMap((response) => {
					this.deletedID = response.id;
					this.deviceService.deleteMapToUser(this.deletedID);
					return this.userService.getUsers();
				})
			)
			.subscribe((users) => {
				this.dataSource = users;
			});
	}
}
