
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { MarouselComponent } from './marousel/marousel.component';
import { ShareModule } from 'src/app/modules/share/share.module';
import { CustomerCategoryCardComponent } from './components/customer-category-card/customer-category-card.component';
import { CustomerCategorySliderComponent } from './components/customer-category-slider/customer-category-slider.component';
import { CustomerTicketCardComponent } from './components/customer-ticket-card/customer-ticket-card.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ListResultShuttleComponent } from './list-result-shuttle/list-result-shuttle.component';
import { DialogShowOrderComponent } from './components/dialog-show-order/dialog-show-order.component';


@NgModule({
  declarations: [
    CustomerComponent,
    MarouselComponent,
    CustomerCategoryCardComponent,
    CustomerCategorySliderComponent,
    CustomerTicketCardComponent,
    HomepageComponent,
    ListResultShuttleComponent,
    DialogShowOrderComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ShareModule
  ],
})
export class CustomerModule { }
