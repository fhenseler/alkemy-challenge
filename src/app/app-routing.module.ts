import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './Components/login/login.component';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { AuthGuard } from './Guards/auth.guard';
import { CommonModule } from '@angular/common';

const routes: Routes = [

	{ path: '', redirectTo: 'Login', pathMatch: 'full' },
	{ path: 'Dashboard', component: DashboardComponent,
		canActivate: [AuthGuard],
	// children: [
	// 	{
	// 	},
 	},
	 
	{ path: '*', redirectTo: 'Login', pathMatch: 'full' },
	{ path: 'Login', component: LoginComponent },
	{ path: '**', redirectTo: 'Login', pathMatch: 'full' }
];

@NgModule({
  imports:[ CommonModule,
RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
