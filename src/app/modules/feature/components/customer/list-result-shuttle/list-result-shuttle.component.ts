import { Component, OnInit } from '@angular/core';
import { filters, singleFilter } from 'src/assets/data/filterData';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';
import { ScheduleAvailable } from '../../brand-owner/model/schedule.model';
import * as moment from 'moment';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-list-result-shuttle',
  templateUrl: './list-result-shuttle.component.html',
  styleUrls: ['./list-result-shuttle.component.scss']
})
export class ListResultShuttleComponent implements OnInit {

  isLoading:boolean = false;
  noData:boolean = true;
  singleFilterData: any;
  filterData: any;
  scheduleAvailable: ScheduleAvailable = {}
  scheduleAvailables: ScheduleAvailable[]=[]

  constructor(private customerService:CustomerService, private router:Router) {

      let travelDate = moment(this.router.getCurrentNavigation()?.extras.state?.['travelDate']).format('yyyy-MM-DD')
      let startPoint = this.router.getCurrentNavigation()?.extras.state?.['startPoint'];
      let endPoint = this.router.getCurrentNavigation()?.extras.state?.['endPoint'];
      this.getAvailableSChedule(startPoint, endPoint, travelDate)
  }

  ngOnInit(): void {
      this.singleFilterData = singleFilter;
      this.filterData = filters;
  
  }
  getAvailableSChedule(startPoint:any, endPoint:any, travelDate:any){
    this.isLoading = true
    let response:any
    this.customerService.getScheduleAvailable(startPoint,endPoint,travelDate).pipe(
      finalize(()=>{
        if(response[0]?.scheduleId){
          this.noData = false
        }
        else{
          this.noData = true
        }
        this.isLoading = false
      })
    ).subscribe(
      data=>{
        this.scheduleAvailables = data.data
        response = data.data
      }
    )
  }
  getDataSearch(data:any){
    let travelDate = moment(data?.travelDate).format('yyyy-MM-DD')
    this.getAvailableSChedule(data?.startPoint, data?.endPoint, travelDate)
  }

}
