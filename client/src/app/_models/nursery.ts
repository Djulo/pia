import { Seedling } from './seedling';

export class Nursery {
  id: string;
  name: string;
  location: string;
  freeSpace: number;
  water: number;
  temperature: number;
  width: number;
  height: number;
  seedlings: Seedling[];
}
