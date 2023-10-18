import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrandOwnerComponent } from "./brand-owner.component";
import { BrandComponent } from "./brand/brand.component";
import { RouteComponent } from "./route/route.component";
import { BusComponent } from "./bus/bus.component";

const routes: Routes = [
  { path: "", redirectTo: "brand", pathMatch: "full" },
  {
    path: "",
    component: BrandOwnerComponent,
    children: [
      { path: "brand", component: BrandComponent },
      { path: "route", component: RouteComponent },
      { path: "bus", component: BusComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandOwnerRoutingModule {}
