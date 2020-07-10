import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Product } from '@app/_models';
import { Order } from '@app/_models/order';

@Injectable({ providedIn: 'root' })
export class OrderService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Order[]>(`${environment.apiUrl}/orders`);
  }

  getById(id: string) {
    return this.http.get<Order>(`${environment.apiUrl}/orders/${id}`);
  }

  update(order: Order) {
    return this.http.put<any>(
      `${environment.apiUrl}/orders/${order.id}`,
      order
    );
  }

  getByFarmerId(id: string) {
    return this.http.get<Order[]>(
      `${environment.apiUrl}/orders/getByFarmerId/${id}`
    );
  }

  create(company: string, order: Order) {
    return this.http.post<any>(`${environment.apiUrl}/orders/create`, {
      company: company,
      order: order,
    });
  }

  delivery(id: string, origin: string, destination: string, companyId: string) {
    return this.http.post<any>(`${environment.apiUrl}/orders/delivery/${id}`, {
      origin: origin,
      destination: destination,
      companyId: companyId,
    });
  }

  delete(id: string) {
    return this.http.delete<any>(`${environment.apiUrl}/orders/${id}`);
  }
}
