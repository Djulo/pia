import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { User } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<User[]>(`${environment.apiUrl}/users`);
  }

  getById(id: string) {
    return this.http.get<User>(`${environment.apiUrl}/users/${id}`);
  }

  getCurrentUser() {
    return this.http.get<User>(`${environment.apiUrl}/users/current`);
  }

  update(user: User) {
    return this.http.put<any>(`${environment.apiUrl}/users/${user.id}`, user);
  }

  changePassword(id: string, oldPassword: string, password: string) {
    return this.http.post<any>(
      `${environment.apiUrl}/users/${id}/changePassword`,
      {
        oldPassword: oldPassword,
        password: password,
      }
    );
  }
}
