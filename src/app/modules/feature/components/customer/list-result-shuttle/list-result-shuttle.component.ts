import { Component, OnInit } from '@angular/core';
import { filters, singleFilter } from 'src/assets/data/filterData';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';
import { ScheduleAvailable } from '../../brand-owner/model/schedule.model';
import * as moment from 'moment';

@Component({
  selector: 'app-list-result-shuttle',
  templateUrl: './list-result-shuttle.component.html',
  styleUrls: ['./list-result-shuttle.component.scss']
})
export class ListResultShuttleComponent implements OnInit {

  singleFilterData: any;
  filterData: any;
  scheduleAvailable: ScheduleAvailable = {}
  scheduleAvailables: ScheduleAvailable[]=[]

  constructor(private customerService:CustomerService, private router:Router) {

      console.log("this.router.getCurrentNavigation()?.extras",this.router.getCurrentNavigation()?.extras.state)
      let travelDate = moment(this.router.getCurrentNavigation()?.extras.state?.['travelDate']).format('yyyy-MM-DD')
      let startPoint = this.router.getCurrentNavigation()?.extras.state?.['startPoint'];
      let endPoint = this.router.getCurrentNavigation()?.extras.state?.['endPoint'];
      this.getAvailableSChedule(startPoint, endPoint, travelDate)
  }

  ngOnInit(): void {
      this.singleFilterData = singleFilter;
      this.filterData = filters;
      // this.router.getCurrentNavigation()?.extras
  
  }
  getAvailableSChedule(startPoint:any, endPoint:any, travelDate:any){
    this.customerService.getScheduleAvailable(startPoint,endPoint,travelDate).pipe().subscribe(
      data=>{
        this.scheduleAvailables = data.data
      }
    )
  }
  getDataSearch(data:any){
    let travelDate = moment(data?.travelDate).format('yyyy-MM-DD')
    this.getAvailableSChedule(data?.startPoint, data?.endPoint, travelDate)
  }

}
