import { Component, OnInit } from '@angular/core';
import { Item, Seedling, Product, Order, Farmer, Nursery } from '@app/_models';
import { ItemService } from '@app/_services/item.service';
import { first } from 'rxjs/operators';
import {
  FarmerService,
  SeedlingService,
  ProductService,
  AuthenticationService,
  CompanyService,
} from '@app/_services';
import { OrderService } from '@app/_services/order.service';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css'],
})
export class StoreComponent implements OnInit {
  loading = false;

  items: Item[];
  cart: Item[] = [];

  farmer: Farmer;
  nursery: Nursery;

  constructor(
    private itemService: ItemService,
    private farmerService: FarmerService,
    private orderService: OrderService,
    private authService: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.itemService
      .getAll()
      .pipe(first())
      .subscribe((items) => {
        this.loading = false;
        this.items = items;
      });

    this.farmerService
      .getById(this.authService.currentUserValue.id)
      .pipe(first())
      .subscribe((farmer) => {
        this.farmer = farmer;
      });
  }

  addToCart(item: Item) {
    let newItem = new Item();
    newItem = Object.assign(newItem, item);

    item.quantity--;
    const index = this.cart.findIndex((element) => element.id === item.id);
    if (index != -1) {
      this.cart[index].quantity++;
    } else {
      newItem.quantity = 1;
      this.cart.push(newItem);
    }

    if (item.quantity == 0) {
      this.items = this.items.filter((i) => i.id != item.id);
    }
  }

  remove(item: Item) {
    let index = this.cart.findIndex((el) => el.id === item.id);
    if (index != -1) {
      this.cart[index].quantity--;
      if (this.cart[index].quantity == 0) {
        this.cart.splice(index, 1);
      }
    }

    index = this.items.findIndex((i) => i.id === item.id);
    if (index != -1) {
      this.items[index].quantity++;
    } else {
      let newItem = new Item();
      newItem = Object.assign(newItem, item);
      newItem.quantity = 1;
      this.items.push(newItem);
    }
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  order() {
    console.log('order');
    if (this.nursery == null) return;

    const map = this.groupBy(this.cart, (item) => item.producer);

    for (const key of map.keys()) {
      const order = new Order();
      order.date = new Date();
      order.confirmed = false;
      order.status = 'Created';
      order.farmer = this.farmer;
      order.nursery = this.nursery;
      order.items = map.get(key);
      order.price = 0;
      for (const item of order.items) {
        order.price += item.price * item.quantity;
      }

      this.orderService.create(key, order).subscribe(() => {
        for (const item of order.items) {
          const index = this.items.findIndex((i) => i.id == item.id);
          if (index != -1) {
            this.items[index].quantity -= item.quantity;
            this.itemService.update(this.items[index]).subscribe();
          } else {
            this.itemService.delete(item.id).subscribe();
          }
        }
        this.cart = [];
      });
    }
  }
}
