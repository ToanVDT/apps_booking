
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { MarouselComponent } from './marousel/marousel.component';
import { ShareModule } from 'src/app/modules/share/share.module';
import { CustomerCategoryCardComponent } from './components/customer-category-card/customer-category-card.component';
import { CustomerCategorySliderComponent } from './components/customer-category-slider/customer-category-slider.component';


@NgModule({
  declarations: [
    CustomerComponent,
    MarouselComponent,
    CustomerCategoryCardComponent,
    CustomerCategorySliderComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ShareModule
  ],
})
export class CustomerModule { }
