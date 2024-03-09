import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { HomeComponent } from './component/home/home.component';
import { CreateDeviceComponent } from './component/createdevice/createdevice.component';
import { AccountsComponent } from './component/accounts/accounts.component';
import { DevicesComponent } from './component/devices/devices.component';
import { authGuard } from './auth.guard';
import { RoleGuard } from './role.component';
import { HistoryComponent } from './component/history/history.component';
import { ChatComponent } from './component/chat/chat.component';

const routes: Routes = [
	{ path: '', component: LoginComponent },
	{ path: 'Register', component: RegisterComponent },
	{ path: 'Home', component: HomeComponent, canActivate: [authGuard] },
	{ path: 'Accounts', component: AccountsComponent, canActivate: [authGuard, RoleGuard] },
	{ path: 'Devices', component: DevicesComponent, canActivate: [authGuard] },
	{ path: 'CreateDevice', component: CreateDeviceComponent, canActivate: [authGuard, RoleGuard] },
	{ path: 'History', component: HistoryComponent, canActivate: [authGuard] },
	{ path: 'Chat', component: ChatComponent, canActivate: [authGuard] }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
