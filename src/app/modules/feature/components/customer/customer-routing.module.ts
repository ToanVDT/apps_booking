import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CustomerComponent } from "./customer.component";
import { HomepageComponent } from "./homepage/homepage.component";
import { ListResultShuttleComponent } from "./list-result-shuttle/list-result-shuttle.component";
import { ProfileCustomerComponent } from "./components/profile-customer/profile-customer.component";
import { HistoryOrderComponent } from "./components/history-order/history-order.component";
import { PromotionComponent } from "./components/promotion/promotion.component";
import { CustomerGuard } from "../auth/hepler/customer.guard";

const routes: Routes = [
  {
    path: "",
    component: CustomerComponent,
    children: [
      { path: "", component: HomepageComponent },
      { path: "list-result-shuttle", component: ListResultShuttleComponent },
      { path: "profile-customer", component: ProfileCustomerComponent,canActivate:[CustomerGuard] },
      { path: "history-order", component: HistoryOrderComponent,canActivate:[CustomerGuard] },
      { path: "promotion", component: PromotionComponent,canActivate:[CustomerGuard] }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerRoutingModule { }
