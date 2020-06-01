import { Component, ViewChildren, QueryList } from '@angular/core';
import { first } from 'rxjs/operators';

import {
  User,
  Nursery,
  Role,
  Farmer,
  Company,
  Product,
  Order,
} from '@app/_models';
import {
  AuthenticationService,
  FarmerService,
  CompanyService,
  UserService,
} from '@app/_services';
import { ItemService } from '@app/_services/item.service';
import { Router } from '@angular/router';
import {
  SortEvent,
  SortColumn,
  NgbdSortableHeader,
} from '@app/storage/sortable.directive';
import { OrderService } from '@app/_services/order.service';

const compare = (v1: string, v2: string) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(orders: Order[], column: SortColumn, direction: string): Order[] {
  if (direction === '' || column === '') {
    return orders;
  } else {
    return [...orders].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

@Component({ templateUrl: 'home.component.html' })
export class HomeComponent {
  loading = false;
  currentUser: User;
  farmer: Farmer;
  company: Company;

  ORDERS: Order[] = [];
  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private router: Router,
    private uesrService: UserService,
    private farmerService: FarmerService,
    private companyService: CompanyService,
    private authenticationService: AuthenticationService,
    private itemService: ItemService,
    private orderService: OrderService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    // redirect to home if already logged in
    if (this.currentUser.role == Role.Admin) {
      this.router.navigate(['/admin']);
    }
  }

  ngOnInit() {
    this.loading = true;
    if (this.currentUser.role == Role.Farmer) {
      this.farmerService
        .getById(this.currentUser.id)
        .pipe(first())
        .subscribe((farmer) => {
          this.loading = false;
          this.farmer = farmer;
        });
    } else if (this.currentUser.role == Role.Company) {
      this.companyService
        .getById(this.currentUser.id)
        .pipe(first())
        .subscribe((company) => {
          this.loading = false;
          this.company = company;
          this.ORDERS = company.orders;
        });
    } else {
      this.uesrService
        .getById(this.currentUser.id)
        .pipe(first())
        .subscribe((user) => {
          this.loading = false;
          this.currentUser = user;
        });
    }
  }

  get orders() {
    return this.company.orders.filter((order) => order.status != 'Delivered');
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.company.orders = sort(this.ORDERS, column, direction);
  }

  checkStatus(order) {
    return order.status == 'Waiting' ? true : false;
  }

  confirmOrder(order: Order) {
    if (this.company.courier == 0) {
      order.status = 'Waiting';
      this.orderService.update(order).subscribe();
      return;
    }

    this.orderService
      .delivery(
        order.id,
        this.company.location,
        order.nursery.location,
        this.company.id
      )
      .subscribe(() => {
        this.companyService
          .getById(this.currentUser.id)
          .pipe(first())
          .subscribe((company) => {
            this.company = company;
            this.ORDERS = company.orders;
          });
      });
    console.log('confirm');
  }

  declineOrder(order: Order) {
    order.status = 'Declined';

    console.log(order);
    this.orderService.update(order).subscribe();
  }

  removeProduct(product: Product) {
    this.itemService.delete(product.id);
  }
}
