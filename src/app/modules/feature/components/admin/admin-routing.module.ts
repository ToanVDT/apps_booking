import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminGuard } from '../auth/hepler/admin.guard';
import { ManageBrandComponent } from './component/manage-brand/manage-brand.component';
import { ManageCustomerComponent } from './component/manage-customer/manage-customer.component';
import { ProfileComponent } from './component/profile/profile.component';

const routes: Routes = [
  { path: "", redirectTo: "manage-brand", pathMatch: "full" },
  {  path: '', canActivate: [AdminGuard], component: AdminComponent, children: [
    { path: "manage-brand", component: ManageBrandComponent },
    { path: "manage-customer", component: ManageCustomerComponent },
    { path: "profile", component: ProfileComponent },

  ],
},
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
