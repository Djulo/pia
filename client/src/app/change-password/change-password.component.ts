import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserService } from '@app/_services';
import { MustMatch } from '@app/_helpers';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css'],
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService,
    private userService: UserService
  ) {}

  // MatchPassword(control: AbstractControl) {
  //   let password = control.get('oldPassword').value;

  //   if (password != this.authenticationService.currentUserValue.password) {
  //     return { MatchPassword: true };
  //   } else {
  //     return null;
  //   }
  // }

  ngOnInit() {
    this.changePasswordForm = this.formBuilder.group(
      {
        oldPassword: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
      },
      {
        validators: [MustMatch('password', 'confirmPassword')],
      }
    );

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.changePasswordForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    this.loading = true;
    this.userService
      .changePassword(
        this.authenticationService.currentUserValue.id,
        this.f.oldPassword.value,
        this.f.password.value
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
}
