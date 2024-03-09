import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class RoleGuard implements CanActivate {
	constructor(private router: Router) { }

	canActivate(
		_next: ActivatedRouteSnapshot,
		_state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		if (JSON.parse(sessionStorage.getItem('jwt') as string).role !== "ADMIN")
		{
			this.router.navigate(['/Home']);
			return false;
		}
		return true;
	}
}