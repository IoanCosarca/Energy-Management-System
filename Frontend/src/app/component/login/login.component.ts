import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationModel } from 'src/app/model/authentication.model';
import { UserService } from 'src/app/service/user.service';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.css']
})
export class LoginComponent {
	hide: boolean = true;

	loginModel: AuthenticationModel = {
		email: '',
		password: ''
	}

	constructor(private fb: FormBuilder, private userService: UserService, private router: Router) { }

	loginForm: FormGroup = this.fb.group({
		email: ['', [Validators.required, Validators.email]],
		password: ['', [Validators.required, Validators.minLength(6)]]
	})

	onLogin(): void {
		if (!this.loginForm.valid) {
			return;
		}
		else {
			this.loginModel.email = this.loginForm.get('email')!.value;
			this.loginModel.password = this.loginForm.get('password')!.value;
			this.userService.authenticate(this.loginModel).subscribe(
				response => {
					sessionStorage.setItem('jwt', JSON.stringify(response));
					this.router.navigate(['/Home']);
				},
				error => {
					console.error(error);
				}
			);
		}
	}
}
