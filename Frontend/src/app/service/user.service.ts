import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountResponse } from '../model/account-response.model';
import { AuthenticationModel } from '../model/authentication.model';
import { IDModel } from '../model/id-response.model';
import { UserRegisterModel } from '../model/user-register.model';
import { UserModel } from '../model/user.model';

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private httpClient: HttpClient) { }

	public getUsers() {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<UserModel[]>(`http://localhost:8080/user/all`, { headers });
	}

	public getIDs() {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<IDModel[]>(`http://localhost:8080/user/ids`, { headers });
	}

	public getUserByID(id: number) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<UserModel>(`http://localhost:8080/user/id/${id}`, { headers });
	}

	public getUserByEmail(email: string) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<UserModel>(`http://localhost:8080/user/email/${email}`, { headers });
	}

	public getIDbyEmail(email: string) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.get<IDModel>(`http://localhost:8080/user/id-email/${email}`, { headers });
	}

	public saveUser(userData: UserRegisterModel) {
		return this.httpClient.post<AccountResponse>(`http://localhost:8080/user/register`, userData);
	}

	public authenticate(userData: AuthenticationModel) {
		return this.httpClient.post<AccountResponse>(`http://localhost:8080/user/authenticate`, userData);
	}

	public updateUser(email: string, userNewData: UserRegisterModel) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.put(`http://localhost:8080/user/${email}`, userNewData, { headers });
	}

	public deleteUser(email: string) {
		let token = JSON.parse(sessionStorage.getItem('jwt') as string);
		const headers = new HttpHeaders({
			'Authorization': `Bearer ${token.token}`
		});
		return this.httpClient.delete<IDModel>(`http://localhost:8080/user/${email}`, { headers });
	}
}
