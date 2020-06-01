import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Product } from '@app/_models';
import { Item } from '@app/_models/item';

@Injectable({ providedIn: 'root' })
export class ItemService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Item[]>(`${environment.apiUrl}/items`);
  }

  getById(id: string) {
    return this.http.get<Item>(`${environment.apiUrl}/items/${id}`);
  }

  update(item: Item) {
    return this.http.put<any>(`${environment.apiUrl}/items/${item.id}`, item);
  }

  create(companyId: string, item: Item) {
    return this.http.post<any>(`${environment.apiUrl}/items/create`, {
      id: companyId,
      item: item,
    });
  }

  delete(id: string) {
    return this.http.delete<any>(`${environment.apiUrl}/items/${id}`);
  }
}
