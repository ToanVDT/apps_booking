import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandOwnerRoutingModule } from './brand-owner-routing.module';
import { BrandOwnerComponent } from './brand-owner.component';


@NgModule({
  declarations: [
    BrandOwnerComponent
  ],
  imports: [
    CommonModule,
    BrandOwnerRoutingModule
  ]
})
export class BrandOwnerModule { }
