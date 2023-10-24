import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AuthGuard } from '../auth/hepler/auth.guard';
import { AdminGuard } from '../auth/hepler/admin.guard';

const routes: Routes = [{ path: '',canActivate:[AdminGuard],component: AdminComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
