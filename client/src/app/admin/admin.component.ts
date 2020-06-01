import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { User } from '@app/_models';
import { UserService } from '@app/_services';

@Component({ templateUrl: 'admin.component.html' })
export class AdminComponent implements OnInit {
  loading = false;
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        this.loading = false;
        this.users = users.filter((u) => u.active == false);
      });
  }

  approve(user: User) {
    user.active = true;
    this.users = this.users.filter((u) => u.active == false);
    this.userService.update(user).subscribe();
  }
}
