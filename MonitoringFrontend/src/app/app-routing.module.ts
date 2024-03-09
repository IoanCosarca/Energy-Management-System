import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MonitorComponent } from './component/monitor/monitor.component';
import { MeasurementsComponent } from './component/measurements/measurements.component';

const routes: Routes = [
	{ path: '', component: MonitorComponent },
	{ path: 'Measurements', component: MeasurementsComponent }
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule]
})
export class AppRoutingModule { }
