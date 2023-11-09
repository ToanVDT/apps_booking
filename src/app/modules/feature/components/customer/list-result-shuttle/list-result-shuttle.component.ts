import { Component, OnInit } from '@angular/core';
import { filters, singleFilter } from 'src/assets/data/filterData';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list-result-shuttle',
  templateUrl: './list-result-shuttle.component.html',
  styleUrls: ['./list-result-shuttle.component.scss']
})
export class ListResultShuttleComponent implements OnInit {


  singleFilterData: any;
  filterData: any;

  constructor(private customerService:CustomerService, private router:Router) {

      console.log("this.router.getCurrentNavigation()?.extras",this.router.getCurrentNavigation()?.extras.state)
  }

  ngOnInit(): void {
      this.singleFilterData = singleFilter;
      this.filterData = filters;
      // this.router.getCurrentNavigation()?.extras
  
  }
  getDataSearch(data:any){
    console.log("data",data)
  }
}
