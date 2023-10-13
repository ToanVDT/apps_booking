import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'customer', pathMatch: 'full' },
    {
        path: 'customer',
        loadChildren: () =>
            import('./modules/feature/components/customer/customer.module').then((m) => m.CustomerModule),
    },
    { path: 'admin', loadChildren: () => import('./modules/feature/components/admin/admin.module').then(m => m.AdminModule) },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
})
export class AppRoutingModule {}
