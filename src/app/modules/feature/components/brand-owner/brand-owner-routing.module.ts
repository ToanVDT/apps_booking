import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BrandOwnerComponent } from './brand-owner.component';

const routes: Routes = [{ path: '', component: BrandOwnerComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BrandOwnerRoutingModule { }
