import { Component, OnDestroy, OnInit } from '@angular/core';
import { singleFilter } from 'src/assets/data/filterData';
import { CustomerService } from '../service/customer.service';
import { Router } from '@angular/router';
import { ScheduleAvailable } from '../../brand-owner/model/schedule.model';
import * as moment from 'moment';
import { finalize } from 'rxjs';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-list-result-shuttle',
  templateUrl: './list-result-shuttle.component.html',
  styleUrls: ['./list-result-shuttle.component.scss']
})
export class ListResultShuttleComponent implements OnInit,OnDestroy {

  isLoading:boolean = false;
  noData:boolean = true;
  singleFilterData: any;
  filterData:any = [];
  radioSelected:any
  selectBrandName:boolean = false;
  listBrandFilter:any=[]
  dataSend:any;
  filterForm:FormGroup;
  scheduleAvailable: ScheduleAvailable = {}
  scheduleAvailables: ScheduleAvailable[]=[]
  selectedFilter: Set<any> = new Set();

  constructor(private customerService:CustomerService, private router:Router) {

      let travelDate = moment(this.router.getCurrentNavigation()?.extras.state?.['travelDate']).format('yyyy-MM-DD')
      let startPoint = this.router.getCurrentNavigation()?.extras.state?.['startPoint'];
      let endPoint = this.router.getCurrentNavigation()?.extras.state?.['endPoint'];
      this.getAvailableSChedule(startPoint, endPoint, travelDate)
      this.filterForm = new FormGroup({
        filterMoney: new FormControl(),
        filterBrandName: new FormControl(),
      })
  }
  ngOnDestroy(): void {
   this.filterData = []
  }
  ngOnInit(): void {
      this.singleFilterData = singleFilter;
      this.filterForm.get("filterMoney")?.valueChanges.subscribe(
        value=>{
          if(value == 3){
            this.scheduleAvailables.sort((a:any,b:any) => b?.price - a?.price);
          }
          else{
            this.scheduleAvailables.sort((a:any,b:any) => a?.price - b?.price);
          }
        }
      )
      this.filterForm.get("filterBrandName")?.valueChanges.subscribe(
        value=>{
          this.selectBrandName = value
        }
      )
  
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
        this.dataSend = data.data
        this.scheduleAvailables = data.data
        response = data.data
        var id = 0
        response.map((item:any)=>{
          this.filterData.push({"id": id,"value":item?.brandName})
          id = id + 1;
        })
        this.listBrandFilter = JSON.parse(JSON.stringify(this.scheduleAvailables))
        console.log("listBrandFilter", this.listBrandFilter)
      }
    )
  }
  getDataSearch(data:any){
    let travelDate = moment(data?.travelDate).format('yyyy-MM-DD')
    this.getAvailableSChedule(data?.startPoint, data?.endPoint, travelDate)
  }
  onCheckChange(event: any){
    const checked = event.target.checked
    const value = event.target.value
    console.log(event.target.value)
    console.log(checked)
    console.log(value)

    if (checked) {
      this.selectedFilter.add(value)
    } else {
      this.selectedFilter.delete(value)
    }
    console.log(this.selectedFilter)

    if (this.selectedFilter.size === 0) {
      this.listBrandFilter = JSON.parse(JSON.stringify(this.scheduleAvailables))
    } else {

      console.log("list", this.listBrandFilter)
      this.listBrandFilter = this.scheduleAvailables.filter((item : any) => this.selectedFilter.has(item.brandName))
      console.log("list", this.listBrandFilter)
  
    }
   


    // let data = {...value,"select":this.selectBrandName}
    // if(data?.select){
    //   console.log("1")
    //   this.listBrandFilter.push({"value":value?.value,"select":data?.select})
    // }
    // else{
    //   this.listBrandFilter.push({"value":value?.value,"select":false})
    //   console.log("2")
    // }
    // this.listBrandFilter = this.listBrandFilter.filter((item : any) => item?.select == true)
  }
}
