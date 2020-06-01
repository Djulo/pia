import { Component, OnInit, Input } from '@angular/core';
import { Nursery, Seedling, Farmer, Product } from '@app/_models';
import { ActivatedRoute } from '@angular/router';
import {
  NurseryService,
  FarmerService,
  AuthenticationService,
} from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-nursery-info',
  templateUrl: './nursery-info.component.html',
  styleUrls: ['./nursery-info.component.css'],
})
export class NurseryInfoComponent implements OnInit {
  nursery: Nursery;
  farmer: Farmer;

  constructor(
    private route: ActivatedRoute,
    private authService: AuthenticationService,
    private nurseryService: NurseryService,
    private farmerService: FarmerService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      console.log(params.get('id'));
      this.nurseryService
        .getById(params.get('id'))
        .pipe(first())
        .subscribe((nursery) => {
          this.nursery = nursery;
        });
    });

    this.farmerService
      .getById(this.authService.currentUserValue.id)
      .pipe(first())
      .subscribe((farmer) => (this.farmer = farmer));
  }

  addWater() {
    this.nursery.water++;
    this.update();
  }

  removeWater() {
    if (this.nursery.water == 0) return;
    this.nursery.water--;
    this.update();
  }

  increaseTemperature() {
    this.nursery.temperature++;
    this.update();
  }

  decreaseTemperature() {
    this.nursery.temperature--;
    this.update();
  }

  getSeedling(position) {
    return this.nursery.seedlings.find((s) => s.position == position);
  }

  private update() {
    this.nurseryService.update(this.nursery).subscribe();
  }

  counter(i: number) {
    return new Array(i);
  }

  planted(seedling: Seedling) {
    console.log('Planted');
    this.nurseryService.addSeedling(this.nursery.id, seedling.id).subscribe();
    this.farmerService
      .removeSeedling(this.authService.currentUserValue.id, seedling.id)
      .subscribe(() => this.refresh());
  }

  removedSeedling(seedling: Seedling) {
    console.log('Removed seedling');
    this.nurseryService
      .removeSeedling(this.nursery.id, seedling)
      .subscribe(() => this.refresh());
  }

  usedProduct(product: Product) {
    this.farmerService
      .removeProduct(this.authService.currentUserValue.id, product.id)
      .subscribe(() => this.refresh());
  }

  private refresh() {
    console.log('refresh');

    this.nurseryService
      .getById(this.nursery.id)
      .pipe(first())
      .subscribe((nursery) => {
        this.nursery = nursery;
      });

    this.farmerService
      .getById(this.authService.currentUserValue.id)
      .pipe(first())
      .subscribe((farmer) => (this.farmer = farmer));
  }
}
