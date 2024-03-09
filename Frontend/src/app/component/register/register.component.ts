import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegisterModel } from 'src/app/model/user-register.model';
import { UserService } from 'src/app/service/user.service';

@Component({
	selector: 'app-register',
	templateUrl: './register.component.html',
	styleUrls: ['./register.component.css']
})
export class RegisterComponent {
	hide: boolean = true;

	registerModel: UserRegisterModel = {
		name: '',
		email: '',
		password: ''
	}

	constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

	registerForm: FormGroup = this.fb.group({
		name: ['', [Validators.required, Validators.pattern('[a-zA-ZăĂâÂîÎșȘțȚ ]*')]],
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]]
	});

	onRegister(): void {
		if (!this.registerForm.valid) {
			return;
		}
		else {
			this.registerModel.name = this.registerForm.get('name')!.value;
			this.registerModel.email = this.registerForm.get('email')!.value;
			this.registerModel.password = this.registerForm.get('password')!.value;
			this.userService.saveUser(this.registerModel).subscribe(
				() => {
					this.router.navigate(['/']);
				},
				error => {
					console.error(error);
				}
			);
		}
	}
}
