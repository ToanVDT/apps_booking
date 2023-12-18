import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Shuttle } from '../../model/shuttle.model';
import { RouteService } from '../../service/route.service';
import { Schedule } from '../../model/schedule.model';
import { Bus } from '../../model/bus.model';
import { ShuttleService } from '../../service/shuttle.service';
import { BusService } from '../../service/bus.service';
import { AuthenticationService } from '../../../auth/service/authentication.service';
import { finalize } from 'rxjs';
import * as moment from 'moment';
@Component({
  selector: 'app-dialog-update-schedule',
  templateUrl: './dialog-update-schedule.component.html',
  styleUrls: ['./dialog-update-schedule.component.scss']
})
export class DialogUpdateScheduleComponent implements OnInit, OnDestroy {

  buses: Bus[] = [];
  user: any;
  shuttle: Shuttle = {}
  shuttles: Shuttle[] = []
  scheduleForm: FormGroup;
  schedule: Schedule = {}
  routes: any;
  startTime: any;
  selectCar: any
  todayFormat: any;
  changeDate:boolean =  false;
  changeTime: boolean = false;
  @Output() createOrUpdate = new EventEmitter<any>();

  constructor(
    private routeService: RouteService, private shuttleService: ShuttleService,
    private busService: BusService, private auth: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.scheduleForm = new FormGroup({
      routeName: new FormControl(this.schedule.routeName, [Validators.required]),
      busName: new FormControl(this.schedule.busName, [Validators.required]),
      startTime: new FormControl(this.schedule.startTime, [Validators.required]),
      dateStart: new FormControl(this.schedule.dateStart, [Validators.required]),
      price: new FormControl(this.schedule.price, [Validators.required]),
      eatingFee: new FormControl(this.schedule.eatingFee, [Validators.required]),
    })
  }
  ngOnDestroy(): void {
    this.buses = []
  }

  ngOnInit(): void {
    const today = new Date();
    this.todayFormat = moment(today).format('yyyy-MM-DD')
    this.user = this.auth.userValue;
    this.routes = this.data.routes
    if(this.data?.schedule){
      this.getBus(this.data?.schedule?.dateStart)
    }
    else{
      this.changeDate = true;
    }
    let selectedRouteName = this.routes.find((item: any) => item.id === this.data.routeId);
    this.scheduleForm.get("routeName")?.setValue(selectedRouteName)

    this.getShuttle(this.data.routeId)
    this.scheduleForm.get("busName")?.valueChanges.subscribe((data) => {
      this.schedule.busName = data

    });
    this.scheduleForm.get("price")?.valueChanges.subscribe((data) => {
      this.schedule.price = data
    })
    this.scheduleForm.get("eatingFee")?.valueChanges.subscribe((data) => {
      this.schedule.eatingFee = data
    })
   this.scheduleForm.get("dateStart")?.disable()
   this.scheduleForm.get("startTime")?.disable()
   this.scheduleForm.get("routeName")?.disable()
    if (this.data.schedule) {
      this.selectCar = { name: this.data.schedule.busName, id: this.data.schedule.busId }
      // this.scheduleForm.get("routeName")?.setValue(this.routes[0])
      this.scheduleForm.get("busName")?.setValue(this.selectCar)
      this.scheduleForm.get("dateStart")?.setValue(this.data.schedule.dateStart)
      this.scheduleForm.get("price")?.setValue(this.data.schedule.price)
      this.scheduleForm.get("eatingFee")?.setValue(this.data.schedule.eatingFee)
      this.changeDate = true
    }
  }

  getShuttle(routeId: any) {
    this.shuttleService.getShuttleByRoute(routeId).pipe(
      finalize(()=>{
        let selectedShuttle = this.shuttles.find((item: any) => item.startTime === this.data.schedule.startTime);
        this.scheduleForm.get("startTime")?.setValue(selectedShuttle)
        this.startTime = selectedShuttle;
        // console.log("dataTime",selectedShuttle)
       
      })
    ).subscribe(
      data => {
        this.shuttles = data.data
        if(!this.data?.schedule){
          this.scheduleForm.get("startTime")?.setValue(this.shuttles[0])
        }
        // this.schedule.startTime = this.shuttles[0];
      }
    ) 
  }

  getBusById(busId: any): boolean {
    let result: any
    result = this.buses.find(item => item.id === busId)
    return !!result
  }

  getBus(travelDate: any) {
    this.buses = []
    this.busService.getBusForDropDownByTravelDateForUpdate(this.user.data?.id, travelDate).pipe(
      finalize(() => {
        if (!this.getBusById(this.selectCar.id)) {
          this.buses.push(this.selectCar)
        }
      })
    ).subscribe(
      data => {
        this.buses = data

      }
    )
  }
  onSubmit() {
    if (this.scheduleForm.valid) {
      this.createOrUpdate.emit({
        id: this.data.schedule?.id,
        busId: this.scheduleForm.value.busName?.id,
        shuttleId: this.scheduleForm.value.startTime?.id,
        travelDate: this.scheduleForm.value.dateStart,
        price: this.scheduleForm.value.price,
        eatingFee: this.scheduleForm.value.eatingFee
      });
    }
  }

}
