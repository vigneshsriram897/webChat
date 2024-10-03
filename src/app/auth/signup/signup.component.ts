import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { SignupService } from '../../services/signup-service.service';
import { TOAST_CONFIG, ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  signupForm: any;

  constructor(private signupService: SignupService, private toastr: ToastrService, private router: Router, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  signup(): void {
    if (this.signupForm.valid) {
      const name = this.signupForm.get('name').value;
      const email = this.signupForm.get('email').value;
      const password = this.signupForm.get('password').value;

      this.signupService.signup(name, email, password).subscribe((response: any) => {
        this.toastr.success(response.message, "Success");
        this.router.navigate(['/login']);
      }, (error: any) => {
        console.error(error);
      });
    }
  }
}