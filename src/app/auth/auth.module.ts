import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginRoutingModule } from './login/login-routing.module';
import { LoginService } from '../services/login-service.service'
import { provideHttpClient } from '@angular/common/http';
import { SignupService } from '../services/signup-service.service';
import { AuthGuard } from './auth.guard';
import { provideToastr, TOAST_CONFIG, ToastrModule } from 'ngx-toastr';
import { provideAnimations } from '@angular/platform-browser/animations';
import { SignupRoutingModule } from './signup/signup-routing.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    LoginRoutingModule, SignupRoutingModule, ToastrModule,
  ], providers: [provideHttpClient(), LoginService, SignupService, AuthGuard, provideAnimations(), provideToastr(), {
    provide: TOAST_CONFIG, useValue: {
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }
  }],
})
export class AuthModule { }