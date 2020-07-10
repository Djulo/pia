import { Component, OnInit } from '@angular/core';
import { User, Role } from '@app/_models';
import { UserService } from '@app/_services';
import { first } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loading = true;
    this.userService
      .getAll()
      .pipe(first())
      .subscribe((users) => {
        this.loading = false;
        this.users = users.filter((u) => u.role != Role.Admin);
      });
  }

  delete(user: User) {
    console.log('Delete');
    this.userService.delete(user.id).subscribe(() => {
      this.users = this.users.filter((u) => u.id != user.id);
    });
  }
}
