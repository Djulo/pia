import {
  Component,
  OnInit,
  Directive,
  Input,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  PipeTransform,
} from '@angular/core';
import { AuthenticationService, FarmerService } from '@app/_services';
import { Farmer, Product, Seedling, Item } from '@app/_models';
import { first, startWith, map } from 'rxjs/operators';
import {
  NgbdSortableHeader,
  SortEvent,
  SortColumn,
} from './sortable.directive';
import { FormControl } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';

const compare = (v1: string, v2: string) => (v1 < v2 ? -1 : v1 > v2 ? 1 : 0);

function sort(
  countries: Item[],
  column: SortColumn,
  direction: string
): Item[] {
  if (direction === '' || column === '') {
    return countries;
  } else {
    return [...countries].sort((a, b) => {
      const res = compare(`${a[column]}`, `${b[column]}`);
      return direction === 'asc' ? res : -res;
    });
  }
}

@Component({
  selector: 'app-storage',
  templateUrl: './storage.component.html',
  styleUrls: ['./storage.component.css'],
  providers: [DecimalPipe],
})
export class StorageComponent implements OnInit {
  farmer: Farmer;
  items: Item[] = [];
  ITEMS: Item[] = [];

  filter = new FormControl('');

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;

  constructor(
    private authenticationService: AuthenticationService,
    private farmerService: FarmerService,
    private pipe: DecimalPipe
  ) {
    this.filter.valueChanges
      .pipe(
        startWith(''),
        map((text) => this.search(text, this.pipe))
      )
      .subscribe((items) => (this.items = items));
  }

  ngOnInit(): void {
    this.farmerService
      .getById(this.authenticationService.currentUserValue.id)
      .pipe(first())
      .subscribe((farmer) => {
        this.farmer = farmer;

        for (const seedling of farmer.storage.seedlings) {
          const item = new Item();
          item.name = seedling.name;
          item.producer = seedling.producer;
          item.type = 'Sadnica';

          const index = this.items.findIndex(
            (element) =>
              element.name == item.name &&
              element.producer == item.producer &&
              element.type == item.type
          );

          if (index == -1) {
            item.quantity = 1;
            this.items.push(item);
          } else {
            this.items[index].quantity++;
          }
        }

        for (const product of farmer.storage.products) {
          const item = new Item();
          item.name = product.name;
          item.producer = product.producer;
          item.type = 'Preparat';

          const index = this.items.findIndex(
            (element) =>
              element.name == item.name &&
              element.producer == item.producer &&
              element.type == item.type
          );

          if (index == -1) {
            item.quantity = 1;
            this.items.push(item);
          } else {
            this.items[index].quantity++;
          }
        }

        this.ITEMS = this.items;
        console.log(this.items);
      });
  }

  onSort({ column, direction }: SortEvent) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.items = sort(this.ITEMS, column, direction);
  }

  search(text: string, pipe: PipeTransform): Item[] {
    return this.ITEMS.filter((item) => {
      const term = text.toLowerCase();
      return (
        item.type.toLowerCase().includes(term) ||
        item.name.toLowerCase().includes(term) ||
        item.producer.toLowerCase().includes(term) ||
        pipe.transform(item.quantity).includes(term)
      );
    });
  }
}
