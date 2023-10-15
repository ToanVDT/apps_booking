import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { BrandOwnerComponent } from "./brand-owner.component";
import { BrandComponent } from "./brand/brand.component";
import { RouteComponent } from "./route/route.component";

const routes: Routes = [
  {
    path: "",
    component: BrandOwnerComponent,
    children: [
      { path: "brand", component: BrandComponent },
      { path: "route", component: RouteComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BrandOwnerRoutingModule {}
