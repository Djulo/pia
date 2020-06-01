import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AdminComponent } from './admin/admin.component';
import { RegisterComponent } from './register/register.component';
import { RegisterCompanyComponent } from './register-company/register-company.component';
import { NurseryInfoComponent } from './nursery-info/nursery-info.component';
import { NurseryCreateComponent } from './nursery-create/nursery-create.component';
import { StorageComponent } from './storage/storage.component';
import { StoreComponent } from './store/store.component';
import { ItemCreateComponent } from './item-create/item-create.component';
import { ItemInfoComponent } from './item-info/item-info.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material/input';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { SeedlingComponent } from './seedling/seedling.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PopoverModule } from 'ngx-smart-popover';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgbdSortableHeader } from './storage/sortable.directive';
import { ChangePasswordComponent } from './change-password/change-password.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatStepperModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    FlexLayoutModule,
    PopoverModule,
    NgbModule,
    NgSelectModule,
  ],
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AdminComponent,
    RegisterComponent,
    RegisterCompanyComponent,
    NurseryInfoComponent,
    NurseryCreateComponent,
    StorageComponent,
    StoreComponent,
    ItemCreateComponent,
    ItemInfoComponent,
    SeedlingComponent,
    NgbdSortableHeader,
    ChangePasswordComponent,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
