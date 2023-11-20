import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrandOwnerComponent } from "./brand-owner.component";
import { BrandComponent } from "./brand/brand.component";
import { RouteComponent } from "./route/route.component";
import { BusComponent } from "./bus/bus.component";
import { ShuttleComponent } from "./shuttle/shuttle.component";
import { ParkingComponent } from "./parking/parking.component";
import { AuthGuard } from "../auth/hepler/auth.guard";
import { ScheduleComponent } from "./schedule/schedule.component";
import { TicketComponent } from "./ticket/ticket.component";
import { OrderComponent } from "./order/order.component";
import { ProfileComponent } from "./profile/profile.component";
import { ImageComponent } from "./image/image.component";
import { ReportComponent } from "./report/report.component";

const routes: Routes = [
  { path: "", redirectTo: "brand", pathMatch: "full" },
  {
    path: "",
    canActivate: [AuthGuard],
    component: BrandOwnerComponent,
    children: [
      { path: "brand", component: BrandComponent },
      { path: "route", component: RouteComponent },
      { path: "bus", component: BusComponent },
      { path: "shuttle", component: ShuttleComponent },
      { path: "parking", component: ParkingComponent },
      { path: "schedule", component: ScheduleComponent },
      { path: "ticket", component: TicketComponent },
      { path: "order", component: OrderComponent },
      { path: "profile", component: ProfileComponent },
      { path: "image", component: ImageComponent },
      { path: "report", component: ReportComponent }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandOwnerRoutingModule { }
