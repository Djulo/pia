import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Nursery, Seedling } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class NurseryService {
  constructor(private http: HttpClient) {}

  getById(id: string) {
    return this.http.get<Nursery>(`${environment.apiUrl}/nurseries/${id}`);
  }

  update(nursery: Nursery) {
    return this.http.put<any>(
      `${environment.apiUrl}/nurseries/${nursery.id}`,
      nursery
    );
  }

  create(userId: string, nursery: Nursery) {
    return this.http.post<any>(`${environment.apiUrl}/nurseries/create`, {
      id: userId,
      nursery: nursery,
    });
  }

  removeSeedling(id: string, seedlingId: Seedling) {
    return this.http.patch<any>(
      `${environment.apiUrl}/nurseries/removeSeedling/${id}`,
      {
        seedlingId: seedlingId,
      }
    );
  }

  addSeedling(id: string, seedlingId: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/nurseries/addSeedling/${id}`,
      {
        seedlingId: seedlingId,
      }
    );
  }
}
