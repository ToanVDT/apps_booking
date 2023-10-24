import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerComponent } from './customer.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ListResultShuttleComponent } from './list-result-shuttle/list-result-shuttle.component';

const routes: Routes = [
  {
      path: '',
      component: CustomerComponent,
      children: [
          { path: '', component: HomepageComponent },
          { path: 'list-result-shuttle', component: ListResultShuttleComponent },
      ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
