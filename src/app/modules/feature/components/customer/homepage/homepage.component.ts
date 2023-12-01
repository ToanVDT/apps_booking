import { Component, OnInit } from '@angular/core';
import { popularRoute, services, vourchers } from 'src/assets/data/popularRoute';
import { CustomerService } from '../service/customer.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  popularRoute: any;
  vourchers: any;
  services: any;

  constructor(private customerService:CustomerService) {}

  ngOnInit(): void {
    this.getRoutePopular();
      this.vourchers = vourchers;
      this.services = services;
  }
  getRoutePopular(){
    let response :any;
    this.customerService.getRoutePopular().pipe(
      finalize(()=>{
        this.popularRoute = response;
        
      })
    ).subscribe(
      data=>{
        response = data.data
      }
    )
  }
}
