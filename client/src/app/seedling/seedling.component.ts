import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Seedling, Farmer, Product } from '@app/_models';
import { SeedlingService } from '@app/_services';

@Component({
  selector: 'app-seedling',
  templateUrl: './seedling.component.html',
  styleUrls: ['./seedling.component.css'],
})
export class SeedlingComponent implements OnInit {
  @Input() position: number;
  @Input() seedling: Seedling;

  @Input() seedlings: Seedling[];
  @Input() products: Product[];

  selectedProduct: Product;
  selectedSeedling: Seedling;

  @Output() planted = new EventEmitter<Seedling>();
  @Output() removedSeedling = new EventEmitter<Seedling>();
  @Output() usedProduct = new EventEmitter<Product>();

  constructor(private seedlingService: SeedlingService) {}

  ngOnInit(): void {}

  addProduct() {
    if (!this.selectedProduct) return;

    this.seedling.progress += this.selectedProduct.advanceTime;
    if (this.seedling.progress > this.seedling.sproutTime)
      this.seedling.progress = this.seedling.sproutTime;
    this.seedlingService.update(this.seedling).subscribe();

    this.usedProduct.emit(this.selectedProduct);
    this.selectedProduct = null;
  }

  plant() {
    if (!this.selectedSeedling) return;

    this.selectedSeedling.planted = true;
    this.selectedSeedling.position = this.position;
    this.seedlingService.update(this.selectedSeedling).subscribe();

    this.planted.emit(this.selectedSeedling);
    this.seedling = this.selectedSeedling;
    this.selectedSeedling = null;
  }

  remove() {
    this.seedlingService.remove(this.seedling.id).subscribe();
    this.removedSeedling.emit(this.seedling);
  }
}
