import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Farmer, Seedling, Product } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class FarmerService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Farmer[]>(`${environment.apiUrl}/farmers`);
  }

  getById(id: string) {
    return this.http.get<Farmer>(`${environment.apiUrl}/farmers/${id}`);
  }

  removeSeedling(id: string, seedlingId: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/farmers/removeSeedling/${id}`,
      {
        seedlingId: seedlingId,
      }
    );
  }

  addSeedling(id: string, seedling: Seedling) {
    return this.http.post<any>(
      `${environment.apiUrl}/farmers/addSeedling/${id}`,
      {
        seedling: seedling,
      }
    );
  }

  addProduct(id: string, product: Product) {
    return this.http.post<any>(
      `${environment.apiUrl}/farmers/addProduct/${id}`,
      {
        product: product,
      }
    );
  }

  removeProduct(id: string, productId: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/farmers/removeProduct/${id}`,
      {
        productId: productId,
      }
    );
  }
}
