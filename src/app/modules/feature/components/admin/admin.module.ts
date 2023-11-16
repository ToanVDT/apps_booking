import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { ProfileComponent } from './component/profile/profile.component';
import { ManageBrandComponent } from './component/manage-brand/manage-brand.component';
import { ManageCustomerComponent } from './component/manage-customer/manage-customer.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ShareModule } from 'src/app/modules/share/share.module';
import { HeaderComponent } from './layout/header/header.component';
import { DialogCreateUserComponent } from './component/manage-brand/dialog-create-user/dialog-create-user.component';


@NgModule({
  declarations: [
    AdminComponent,
    ProfileComponent,
    ManageBrandComponent,
    ManageCustomerComponent,
    SidebarComponent,
    HeaderComponent,
    DialogCreateUserComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    ShareModule
  ]
})
export class AdminModule { }
