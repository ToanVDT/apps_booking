import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './modules/feature/components/customer/customer.component';
import { UnauthorizedComponent } from './modules/share/components/forbidden/unauthorized.component';
import { PaymentSuccessComponent } from './modules/share/components/payment-success/payment-success.component';
import { PaymentFailedComponent } from './modules/share/components/payment-failed/payment-failed.component';

const routes: Routes = [
  {path:'', redirectTo:'customer', pathMatch:'full'},
  {path: 'payment-success',component:PaymentSuccessComponent},
  {path: 'payment-failed',component:PaymentFailedComponent},
  {path:'forbidden', component:UnauthorizedComponent},
  {
    path: 'admin',
    loadChildren: () =>
      import('./modules/feature/components/admin/admin.module').then(
        (m) => m.AdminModule
      ),
  },
  {
    path: 'customer',
    loadChildren: () =>
      import('./modules/feature/components/customer/customer.module').then(
        (m) => m.CustomerModule
      ),
  },
  { path: 'brand-owner', loadChildren: () => import('./modules/feature/components/brand-owner/brand-owner.module').then(m => m.BrandOwnerModule) },
  { path: 'auth', loadChildren: () => import('./modules/feature/components/auth/auth.module').then(m => m.AuthModule) },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
