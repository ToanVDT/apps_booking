import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shuttle } from '../../model/shuttle.model';
import { RouteService } from '../../service/route.service';
import { Schedule } from '../../model/schedule.model';
import { Bus } from '../../model/bus.model';
import { ShuttleService } from '../../service/shuttle.service';
import { BusService } from '../../service/bus.service';
import { AuthenticationService } from '../../../auth/service/authentication.service';

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.scss']
})
export class DialogScheduleComponent implements OnInit {

  buses: Bus[]=[];
  user:any;
  shuttle:Shuttle = {}
  shuttles:Shuttle[]=[]
  scheduleForm:FormGroup;
  schedule:Schedule = {}
  routes:any;
  startTime:any;

  @Output() createOrUpdate = new EventEmitter<any>();

  constructor(
    private routeService: RouteService,private shuttleService:ShuttleService,
    private busService: BusService, private auth:AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scheduleForm = new FormGroup({     
      routeName:new FormControl(this.schedule.routeName,[Validators.required]),
      busName:new FormControl(this.schedule.busName,[Validators.required]),
      startTime:new FormControl(this.schedule.startTime,[Validators.required]),
      dateStart:new FormControl(this.schedule.dateStart,[Validators.required]),
      price:new FormControl(this.schedule.price,[Validators.required]),
      eatingFee:new FormControl(this.schedule.eatingFee,[Validators.required]),
    })
  }

  ngOnInit(): void {
  // this.buses = this.data.bus,
  this.user = this.auth.userValue;
  this.routes = this.data.routes
  this.getShuttle(this.data.routeId)
  this.scheduleForm.get("routeName")?.valueChanges.subscribe((data)=>{
    this.schedule.routeName = data
    this.getShuttle(data?.id)
  })
    this.scheduleForm.get("busName")?.valueChanges.subscribe((data) => {
      this.schedule.busName = data
    });
    this.scheduleForm.get("startTime")?.valueChanges.subscribe((data) => {
      this.schedule.startTime = data
      this.startTime = data;
    });
    this.scheduleForm.get("dateStart")?.valueChanges.subscribe((data)=>{
      this.schedule.dateStart = data
      this.getBus(this.schedule.dateStart, this.startTime);
    })
    this.scheduleForm.get("price")?.valueChanges.subscribe((data)=>{
      this.schedule.price = data
    })
    this.scheduleForm.get("eatingFee")?.valueChanges.subscribe((data)=>{
      this.schedule.eatingFee = data
    })
    if(this.data.schedule){
      console.log("data",this.data,this.data.routeId)
      let selectedRouteName = this.routes.find((item: any) => item.id === this.data.routeId);
      this.scheduleForm.get("routeName")?.setValue(selectedRouteName)
      this.scheduleForm.get("busName")?.setValue(this.data.schedule.busName)
      let selectedShuttle = this.shuttles.find((item: any) => item.startTime === this.data.schedule.startTime);
      this.scheduleForm.get("startTime")?.setValue(selectedShuttle)
      this.scheduleForm.get("dateStart")?.setValue(this.data.schedule.dateStart)
      this.scheduleForm.get("price")?.setValue(this.data.schedule.price)
      this.scheduleForm.get("eatingFee")?.setValue(this.data.schedule.eatingFee)
  }
  }
 
getShuttle(routeId:any){
  this.shuttleService.getShuttleByRoute(routeId).pipe().subscribe(
    data=>{
      this.shuttles = data.data
    }
  )
}
getBus(travelDate:any, startTime:any){
 this.busService.getBusForDropDownByTravelDate(this.user.data?.id,travelDate).pipe().subscribe(
  data=>{
    this.buses = data
  }
 )
}
  onSubmit() {
    if (this.scheduleForm.valid) {
      this.createOrUpdate.emit({
        id: this.data.schedule?.id,
        busId:this.scheduleForm.value.busName?.id,
        shuttleId:this.scheduleForm.value.startTime?.id,
        travelDate:this.scheduleForm.value.dateStart,
        price:this.scheduleForm.value.price,
        eatingFee:this.scheduleForm.value.eatingFee
      });
    }
  }

}
