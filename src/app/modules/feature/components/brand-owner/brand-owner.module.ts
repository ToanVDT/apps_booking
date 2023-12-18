import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandOwnerRoutingModule } from './brand-owner-routing.module';
import { BrandOwnerComponent } from './brand-owner.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { ShareModule } from 'src/app/modules/share/share.module';
import { BrandComponent } from './brand/brand.component';
import { HeaderComponent } from './layout/header/header.component';
import { DialogCreateBrandComponent } from './brand/dialog-create-brand/dialog-create-brand.component';
import { RouteComponent } from './route/route.component';
import { DialogCreateUpdateRouteComponent } from './route/dialog-create-update-route/dialog-create-update-route.component';
import { BusComponent } from './bus/bus.component';
import { BusDialogComponent } from './bus/bus-dialog/bus-dialog.component';
import { ShuttleComponent } from './shuttle/shuttle.component';
import { DialogShuttleComponent } from './shuttle/dialog-shuttle/dialog-shuttle.component';
import { DialogEditShuttleComponent } from './shuttle/dialog-edit-shuttle/dialog-edit-shuttle.component';
import { ParkingComponent } from './parking/parking.component';
import { DialogPickUpComponent } from './parking/dialog-pick-up/dialog-pick-up.component';
import { DialogDropOffComponent } from './parking/dialog-drop-off/dialog-drop-off.component';
import { ImageComponent } from './image/image.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { DialogScheduleComponent } from './schedule/dialog-schedule/dialog-schedule.component';
import { TicketComponent } from './ticket/ticket.component';
import { OrderComponent } from './order/order.component';
import { BookingComponent } from './ticket/booking/booking.component';
import { ProfileComponent } from './profile/profile.component';
import { DialogConfirmOrderComponent } from './order/dialog-confirm-order/dialog-confirm-order.component';
import { DialogDepositOrderComponent } from './order/dialog-deposit-order/dialog-deposit-order.component';
import { DialogInformComponent } from './order/dialog-inform/dialog-inform.component';
import { DialogDetailComponent } from './order/dialog-detail/dialog-detail.component';
import { DialogParkingComponent } from './parking/dialog-parking/dialog-parking.component';
import { ReportComponent } from './report/report.component';
import { DialogUpdateScheduleComponent } from './schedule/dialog-update-schedule/dialog-update-schedule.component';


@NgModule({
  declarations: [
    BrandOwnerComponent,
    SidebarComponent,
    BrandComponent,
    HeaderComponent,
    DialogCreateBrandComponent,
    RouteComponent,
    DialogCreateUpdateRouteComponent,
    BusComponent,
    BusDialogComponent,
    ShuttleComponent,
    DialogShuttleComponent,
    DialogEditShuttleComponent,
    ParkingComponent,
    DialogPickUpComponent,
    DialogDropOffComponent,
    ImageComponent,
    ScheduleComponent,
    DialogScheduleComponent,
    TicketComponent,
    OrderComponent,
    BookingComponent,
    ProfileComponent,
    DialogConfirmOrderComponent,
    DialogDepositOrderComponent,
    DialogInformComponent,
    DialogDetailComponent,
    DialogParkingComponent,
    ReportComponent,
    DialogUpdateScheduleComponent
  ],
  imports: [
    CommonModule,
    BrandOwnerRoutingModule,
    ShareModule
  ]
})
export class BrandOwnerModule { }
