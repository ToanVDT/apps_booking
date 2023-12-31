
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
import { ProfileCustomerComponent } from './components/profile-customer/profile-customer.component';
import { HistoryOrderComponent } from './components/history-order/history-order.component';
import { CurrentOrderComponent } from './components/history-order/current-order/current-order.component';
import { PastOrderComponent } from './components/history-order/past-order/past-order.component';
import { CancelOrderComponent } from './components/history-order/cancel-order/cancel-order.component';
import { PromotionComponent } from './components/promotion/promotion.component';
import { ShowDetailOrderCustomerComponent } from './components/history-order/current-order/show-detail-order-customer/show-detail-order-customer.component';


@NgModule({
  declarations: [
    CustomerComponent,
    MarouselComponent,
    CustomerCategoryCardComponent,
    CustomerCategorySliderComponent,
    CustomerTicketCardComponent,
    HomepageComponent,
    ListResultShuttleComponent,
    DialogShowOrderComponent,
    ProfileCustomerComponent,
    HistoryOrderComponent,
    CurrentOrderComponent,
    PastOrderComponent,
    CancelOrderComponent,
    PromotionComponent,
    ShowDetailOrderCustomerComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    ShareModule
  ],
})
export class CustomerModule { }
