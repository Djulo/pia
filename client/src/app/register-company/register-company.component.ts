import { Component, OnInit, Type } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { AuthenticationService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { Role } from '@app/_models/role';

@Component({
  selector: 'app-register-company',
  templateUrl: './register-company.component.html',
})
export class RegisterCompanyComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService
  ) {
    // redirect to home if already logged in
    if (
      this.authenticationService.currentUserValue &&
      this.authenticationService.currentUserValue.role != Role.Admin
    ) {
      this.router.navigate(['/']);
    }
  }

  ngOnInit() {
    this.registerForm = this.formBuilder.group(
      {
        username: ['', Validators.required],
        name: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        est: ['', Validators.required],
        location: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        recaptchaReactive: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService
      .register(
        this.f.username.value,
        this.f.password.value,
        this.f.email.value,
        Role.Company,
        this.f.location.value,
        null,
        null,
        this.authenticationService.currentUserValue.role === Role.Admin
      )
      .pipe(first())
      .subscribe(
        (data) => {
          this.router.navigate([this.returnUrl]);
        },
        (error) => {
          this.error = error;
          this.loading = false;
        }
      );
  }

  resolved(captchaResponse: string) {
    console.log(`Resolved response token: ${captchaResponse}`);
    this.authenticationService.sendToken(captchaResponse).subscribe();
  }
}
