import { Order } from './order';
import { User } from './user';
import { Item } from './item';

export class Company extends User {
  orders: Order[];
  items: Item[];
  location: string;
  courier: number;
}
