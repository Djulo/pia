import { Nursery } from './nursery';
import { User } from './user';
import { Product } from './product';
import { Seedling } from './seedling';

export class Farmer extends User {
  firstName: string;
  lastName: string;
  nurseries: Nursery[];
  storage: {
    products: Product[];
    seedlings: Seedling[];
  };
}
