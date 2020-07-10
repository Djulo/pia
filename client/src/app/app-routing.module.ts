import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { AdminComponent } from './admin/admin.component';
import { Role } from './_models';
import { RegisterComponent } from './register/register.component';
import { RegisterCompanyComponent } from './register-company';
import { NurseryInfoComponent } from './nursery-info/nursery-info.component';
import { NurseryCreateComponent } from './nursery-create/nursery-create.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { StoreComponent } from './store/store.component';
import { StorageComponent } from './storage/storage.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { StatisticsComponent } from './statistics/statistics.component';
import { UsersComponent } from './users/users.component';
import { CreateUserComponent } from './admin/create-user/create-user.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
  },
  {
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
  },
  {
    path: 'users/create',
    component: CreateUserComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin] },
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'register/company', component: RegisterCompanyComponent },
  {
    path: 'changePassword',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Farmer, Role.Company, Role.Admin] },
  },
  {
    path: 'nurseries/create',
    component: NurseryCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Farmer] },
  },
  {
    path: 'nurseries/:id',
    component: NurseryInfoComponent,
  },
  {
    path: 'items/create',
    component: ItemCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Admin, Role.Company] },
  },
  {
    path: 'items/:id',
    component: ItemInfoComponent,
  },
  {
    path: 'store',
    component: StoreComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Farmer] },
  },
  {
    path: 'storage',
    component: StorageComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Farmer] },
  },
  {
    path: 'statistics',
    component: StatisticsComponent,
    canActivate: [AuthGuard],
    data: { roles: [Role.Company] },
  },

  // otherwise redirect to home
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
