import { Item } from './item';
import { Farmer } from './farmer';
import { Nursery } from './nursery';

export class Order {
  id: string;
  items: Item[];
  price: number;
  farmer: Farmer;
  nursery: Nursery;
  date: Date;
  confirmed: boolean;
  status: string;
}
