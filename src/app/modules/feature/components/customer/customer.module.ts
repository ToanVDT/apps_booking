import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { MarouselComponent } from './marousel/marousel.component';
import { FeatureModule } from '../../feature.module';
import { ShareModule } from 'src/app/modules/share/share.module';


@NgModule({
  declarations: [
    CustomerComponent,
    MarouselComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    FeatureModule,
    ShareModule
  ],
  exports:[
    
  ]
})
export class CustomerModule { }
