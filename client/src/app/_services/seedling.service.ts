import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Seedling } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class SeedlingService {
  constructor(private http: HttpClient) {}

  getById(id: string) {
    return this.http.get<Seedling>(`${environment.apiUrl}/seedlings/${id}`);
  }

  update(seedling: Seedling) {
    return this.http.put<any>(
      `${environment.apiUrl}/seedlings/${seedling.id}`,
      seedling
    );
  }

  create(nurseryId: string, seedling: Seedling) {
    console.log(seedling);
    return this.http.post<any>(`${environment.apiUrl}/seedlings/create`, {
      id: nurseryId,
      seedling: seedling,
    });
  }

  remove(id: string) {
    return this.http.delete<any>(`${environment.apiUrl}/seedlings/${id}`);
  }
}
