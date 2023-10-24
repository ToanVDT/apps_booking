import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shuttle } from '../../model/shuttle.model';
import { RouteService } from '../../service/route.service';
import { Schedule } from '../../model/schedule.model';
import { Bus } from '../../model/bus.model';
import { ShuttleService } from '../../service/shuttle.service';

@Component({
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.scss']
})
export class DialogScheduleComponent implements OnInit {

  buses: Bus[]=[];
  shuttle:Shuttle = {}
  shuttles:Shuttle[]=[]
  scheduleForm:FormGroup;
  schedule:Schedule = {}
  routes:any;

  @Output() createOrUpdate = new EventEmitter<any>();

  constructor(
    private routeService: RouteService,private shuttleService:ShuttleService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scheduleForm = new FormGroup({     
      routeName:new FormControl(this.schedule.routeName,[Validators.required]),
      busName:new FormControl(this.schedule.busName,[Validators.required]),
      startTime:new FormControl(this.schedule.startTime,[Validators.required]),
      dateStart:new FormControl(this.schedule.dateStart,[Validators.required]),
      price:new FormControl(this.schedule.price,[Validators.required]),
      eatingFee:new FormControl(this.schedule.eatingFee,[Validators.required]),
      route:new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
  console.log("dataRecieve", this.data)
  this.buses = this.data.bus,
  this.routes = this.data.routes
    this.scheduleForm.get("busName")?.valueChanges.subscribe((data) => {
      this.schedule.busName = data
    });
    this.scheduleForm.get("startTime")?.valueChanges.subscribe((data) => {
      this.schedule.startTime = data
    });
    this.scheduleForm.get("dateStart")?.valueChanges.subscribe((data)=>{
      this.schedule.dateStart = data
    })
    this.scheduleForm.get("price")?.valueChanges.subscribe((data)=>{
      this.schedule.price = data
    })
    this.scheduleForm.get("eatingFee")?.valueChanges.subscribe((data)=>{
      this.schedule.eatingFee = data
    })
    if(this.data.schedule){
      // let selectedRouteName = this.buses.find((item: any) => item.name === this.data.schedule.busName);
      // this.scheduleForm.get("busName")?.setValue(selectedRouteName)
      let selectedBusName = this.buses.find((item: any) => item.name === this.data.schedule.busName);
      this.scheduleForm.get("busName")?.setValue(selectedBusName)
      let selectedShuttle = this.buses.find((item: any) => item.startTime === this.data.schedule.startTime);
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
  onSubmit() {
    if (this.scheduleForm.valid) {
      // console.log("value", this.shuttleForm.value)
    //   this.createOrUpdate.emit({
    //     id: this.data.shuttle?.id,
    //     startTime:this.shuttleForm.value.startTime,
    //     endTime:this.shuttleForm.value.endTime,
    //     routeId:this.routeId.id,
    //     dropOffs:this.shuttleForm.value.dropOffs,
    //     pickUps:this.shuttleForm.value.pickUps
    //   });
    // }
  }
  }
}
