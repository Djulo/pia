import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Company, Order } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class CompanyService {
  private apiKey = 'AIzaSyD0hKJB9Urho0ojkP73-c-C986LjM0lAmE';
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Company[]>(`${environment.apiUrl}/companies`);
  }

  getById(id: string) {
    return this.http.get<Company>(`${environment.apiUrl}/companies/${id}`);
  }

  updateCourier(company: Company) {
    return this.http.post<any>(
      `${environment.apiUrl}/companies/${company.id}`,
      {}
    );
  }

  getByUsername(username: string) {
    return this.http.get<Company>(
      `${environment.apiUrl}/companies/name/${username}`
    );
  }

  checkDistance(origin: string, destination: string) {
    return this.http.get<any>(
      `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&key=${this.apiKey}`
    );
  }
}
