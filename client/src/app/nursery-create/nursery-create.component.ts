import { Component, OnInit, Type } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { NurseryService, AuthenticationService } from '@app/_services';
import { Nursery } from '@app/_models';

@Component({
  selector: 'app-nursery-create',
  templateUrl: './nursery-create.component.html',
  styleUrls: ['./nursery-create.component.css'],
})
export class NurseryCreateComponent implements OnInit {
  nurseryCreateForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private nurseryService: NurseryService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.nurseryCreateForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: ['', Validators.required],
      width: [0, Validators.required],
      height: [0, Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // convenience getter for easy access to form fields
  get f() {
    return this.nurseryCreateForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.nurseryCreateForm.invalid) {
      return;
    }

    this.loading = true;
    const nursery = new Nursery();
    nursery.name = this.f.name.value;
    nursery.location = this.f.location.value;
    nursery.temperature = 18;
    nursery.water = 200;
    nursery.width = this.f.width.value;
    nursery.height = this.f.height.value;
    nursery.freeSpace = this.f.width.value * this.f.height.value;

    this.nurseryService
      .create(this.authenticationService.currentUserValue.id, nursery)
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
