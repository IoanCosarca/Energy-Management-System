import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./component/login/login.component";
import { RegisterComponent } from "./component/register/register.component";
import { HomeComponent } from "./component/home/home.component";
import { NavbarComponent } from "./component/navbar/navbar.component";
import { CreateDeviceComponent } from "./component/createdevice/createdevice.component";
import { AccountsComponent } from "./component/accounts/accounts.component";
import { DevicesComponent } from "./component/devices/devices.component";
import { UserService } from "./service/user.service";
import { HistoryComponent } from './component/history/history.component';
import { ChatComponent } from './component/chat/chat.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { ToastrModule } from 'ngx-toastr';
import { NgApexchartsModule } from "ng-apexcharts";
import { NbThemeModule, NbLayoutModule, NbSidebarModule, NbChatModule, NbTooltipModule, NbCardModule } from "@nebular/theme";
import { CommonModule, DatePipe } from "@angular/common";

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		RegisterComponent,
		HomeComponent,
		NavbarComponent,
		CreateDeviceComponent,
		AccountsComponent,
		DevicesComponent,
		HistoryComponent,
		ChatComponent
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		FormsModule,
		MatCardModule,
		MatButtonModule,
		MatInputModule,
		MatIconModule,
		MatToolbarModule,
		MatTableModule,
		MatSelectModule,
		MatDatepickerModule,
		MatNativeDateModule,
		MatSidenavModule,
		MatListModule,
		ReactiveFormsModule,
		BrowserAnimationsModule,
		ToastrModule.forRoot(),
		HttpClientModule,
		NgApexchartsModule,
		NbThemeModule.forRoot({ name: 'dark' }),
		NbLayoutModule,
		NbSidebarModule.forRoot(),
		NbChatModule,
		NbCardModule,
		NbTooltipModule,
		CommonModule
	],
	providers: [UserService, DatePipe],
	bootstrap: [AppComponent]
})
export class AppModule { }
