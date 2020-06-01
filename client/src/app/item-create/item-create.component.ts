import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { MatStepperModule } from '@angular/material/stepper';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  NurseryService,
  AuthenticationService,
  CompanyService,
} from '@app/_services';
import { Nursery, Item, Company } from '@app/_models';
import { ItemService } from '@app/_services/item.service';
import Stepper from 'bs-stepper';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-item-create',
  templateUrl: './item-create.component.html',
  styleUrls: ['./item-create.component.css'],
})
export class ItemCreateComponent implements OnInit {
  typeFormGroup: FormGroup;
  detailsFormGroup: FormGroup;
  fourthFormGroup: FormGroup;
  fifthFormGroup: FormGroup;
  sixthFormGroup: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  types = [
    { value: 'Preparat', viewValue: 'Preparat' },
    { value: 'Sadnica', viewValue: 'Sadnica' },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private itemService: ItemService,
    private authenticationService: AuthenticationService
  ) {}

  ngOnInit() {
    this.typeFormGroup = this.formBuilder.group({
      type: ['', Validators.required],
      sproutTime: [''],
      advanceTime: [''],
    });
    this.detailsFormGroup = this.formBuilder.group({
      name: ['', Validators.required],
    });
    this.fourthFormGroup = this.formBuilder.group({
      quantity: ['', Validators.required],
    });
    this.fifthFormGroup = this.formBuilder.group({
      price: ['', Validators.required],
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get type() {
    return this.typeFormGroup.controls.type.value;
  }
  get sproutTime() {
    return this.typeFormGroup.controls.sproutTime.value;
  }
  get advanceTime() {
    return this.typeFormGroup.controls.advanceTime.value;
  }
  get name() {
    return this.detailsFormGroup.controls.name.value;
  }
  get producer() {
    return this.detailsFormGroup.controls.producer.value;
  }
  get quantity() {
    return this.fourthFormGroup.controls.quantity.value;
  }
  get price() {
    return this.fifthFormGroup.controls.price.value;
  }

  done() {
    const item = new Item();
    item.type = this.type;
    item.name = this.name;
    item.producer = this.authenticationService.currentUserValue.username;
    item.quantity = this.quantity;
    item.price = this.price;
    if (this.sproutTime) item.sproutTime = this.sproutTime;
    if (this.advanceTime) item.advanceTime = this.advanceTime;

    this.itemService
      .create(this.authenticationService.currentUserValue.id, item)
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
