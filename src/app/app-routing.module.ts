import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginGuard } from './auth/login.guard';
import { AuthGuard } from './auth/auth.guard';
import { SignupComponent } from './auth/signup/signup.component';
import { LoginComponent } from './auth/login/login.component';

const routes: Routes = [{
  path: 'signup',
  // loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  component: SignupComponent,
  canActivate: [LoginGuard]
},
{
  path: 'login',
  // loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule),
  component: LoginComponent,
  canActivate: [LoginGuard]
},
{
  path: '',
  loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule),
  canActivate: [AuthGuard]
},
{ path: '**', redirectTo: '/login', pathMatch: 'full' },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
