import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (_route, _state) => {
	const token = JSON.parse(sessionStorage.getItem('jwt') as string);
	const router = inject(Router);
	if (token) {
		return true;
	}
	else {
		router.navigate(['/']);
		return false;
	}
};
