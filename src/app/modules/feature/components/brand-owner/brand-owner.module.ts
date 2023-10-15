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


@NgModule({
  declarations: [
    BrandOwnerComponent,
    SidebarComponent,
    BrandComponent,
    HeaderComponent,
    DialogCreateBrandComponent,
    RouteComponent,
    DialogCreateUpdateRouteComponent
  ],
  imports: [
    CommonModule,
    BrandOwnerRoutingModule,
    ShareModule
  ]
})
export class BrandOwnerModule { }
