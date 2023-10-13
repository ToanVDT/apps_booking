import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { MainCarouselComponent } from './components/main-carousel/main-carousel.component';
import { ShareModule } from 'src/app/modules/share/share.module';
import { MatRadioModule } from '@angular/material/radio';


@NgModule({
  declarations: [
    CustomerComponent,
    MainCarouselComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ShareModule,
    MatRadioModule
  ]
})
export class CustomerModule { }
