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
  selector: 'app-dialog-schedule',
  templateUrl: './dialog-schedule.component.html',
  styleUrls: ['./dialog-schedule.component.scss']
})
export class DialogScheduleComponent implements OnInit, OnDestroy {

  buses: Bus[] = [];
  user: any;
  shuttle: Shuttle = {}
  shuttles: Shuttle[] = []
  shuttleReturn: Shuttle = {}
  shuttlesReturn: Shuttle[] = []
  scheduleForm: FormGroup;
  schedule: Schedule = {}
  routes: any;
  dateRangeStart:any;
  dateRangeEnd:any;
  today:any ;
  startTime: any;
  startTimeReturnRoute: any;
  dateEnd: any;
  selectReturnRoute: boolean = false;
  returnRoute: any;
  selectCar: any;
  listDateStart: any = []
  listDateStartReturn: any = []
  dateSelected: any;
  dateReturnSelected: any;
  dateValid!:boolean;
  changeDate: boolean = false;
  changeTime: boolean = false;
  disableUpdate:boolean = false;

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
      dateEnd: new FormControl("", [Validators.required]),
      price: new FormControl(this.schedule.price, [Validators.required]),
      eatingFee: new FormControl(this.schedule.eatingFee, [Validators.required]),
      returnRoute: new FormControl(),
      checkReturnRoute: new FormControl(),
      startTimeReturnRoute: new FormControl()
    })
  }
  ngOnDestroy(): void {
    this.buses = []
  }

  ngOnInit(): void {
    this.today = new Date();
    this.user = this.auth.userValue;
    this.routes = this.data.routes
    if (this.data?.schedule) {
      // this.getBus(this.data?.schedule?.dateStart, this.data?.schedule?.startTime)
    }
    else {
      this.changeDate = true;
    }
    let selectedRouteName = this.routes.find((item: any) => item.id === this.data.routeId);
    this.scheduleForm.get("routeName")?.setValue(selectedRouteName)
    this.getShuttle(this.data.routeId)
    this.getReturnRoute(this.data.routeId)
    this.scheduleForm.get("routeName")?.valueChanges.subscribe((data) => {
      this.schedule.routeName = data
      this.getShuttle(data?.id)
      this.getReturnRoute(data?.id)
    })
    this.scheduleForm.get("checkReturnRoute")?.valueChanges.subscribe((data) => {
      this.selectReturnRoute = data;
      this.dateRangeChange(this.dateRangeStart, this.dateRangeEnd)
    })
    this.scheduleForm.get("busName")?.valueChanges.subscribe((data) => {
      this.schedule.busName = data

    });
    this.scheduleForm.get("startTime")?.valueChanges.subscribe((data) => {
      this.schedule.startTime = data
      this.startTime = data;
    });
    this.scheduleForm.get("startTimeReturnRoute")?.valueChanges.subscribe((data) => {
      this.startTimeReturnRoute = data;
    });
    // this.scheduleForm.get("dateStart")?.valueChanges.subscribe((data) => {
    //   this.schedule.dateStart = data
    //   console.log()
    //   if (this.changeDate) {
    //     // this.getBus(this.schedule.dateStart, this.startTime?.startTime);
    //   }
    // })
    this.scheduleForm.get("dateEnd")?.valueChanges.subscribe((data) => {
      if (data) {
        this.dateEnd = data;
      }
    })
    this.scheduleForm.get("price")?.valueChanges.subscribe((data) => {
      this.schedule.price = data
    })
    this.scheduleForm.get("eatingFee")?.valueChanges.subscribe((data) => {
      this.schedule.eatingFee = data
    })
  }
  dateRangeChange(dateRangeStart: HTMLInputElement, dateRangeEnd: HTMLInputElement) {
    this.listDateStart = []
    this.listDateStartReturn = []
    let dateEnd:any
    this.dateRangeStart = dateRangeStart
    this.dateRangeEnd = dateRangeEnd
    let selectedRouteName = this.scheduleForm.get("routeName")?.value
    let duration = selectedRouteName?.duration;
    this.dateSelected = moment(`${dateRangeStart.value} ${this.startTime.startTime}`, 'DD/MM/YYYY hh:mm:ss').toDate()
    let dateCondition = moment(`${dateRangeStart.value}`, 'DD/MM/YYYY').toDate()
    if(!moment(dateCondition).isSameOrAfter(this.today)){
      this.dateValid = false
      this.scheduleForm.get("dateStart")?.setErrors({dateValid:true})
    }
    else{
      this.dateValid = true
      let dateEndFormat = moment(`${dateRangeEnd.value} ${this.startTime.startTime}`, 'DD/MM/YYYY hh:mm:ss').toDate()
      this.listDateStart.push(moment(this.dateSelected).format('yyyy-MM-DD'))
  
      if (this.selectReturnRoute) {
        duration = duration * 2;
        this.dateReturnSelected = moment(this.dateSelected).add(selectedRouteName?.duration, 'hours').toDate()
        if (moment(this.dateReturnSelected).format('HH:mm:ss') > this.startTimeReturnRoute.startTime) {
          this.dateReturnSelected = moment(this.dateSelected).add(23, 'hours').toDate()
        }
        this.listDateStartReturn.push(moment(this.dateReturnSelected).format('yyyy-MM-DD'))
      }
      else {
        duration = duration;
      }
      while (moment(this.dateSelected).isBefore(dateEndFormat)) {
        this.dateSelected = moment(this.dateSelected).add(duration, 'hours').toDate()
        this.dateReturnSelected = moment(this.dateReturnSelected).add(duration, 'hours').toDate()
        if (!moment(this.dateSelected).isAfter(dateEndFormat)) {
          if (moment(this.dateSelected).format('HH:mm:ss') > this.startTime.startTime) {
            this.dateSelected = moment(this.dateSelected).add(23, 'hours').toDate()
          }
          this.listDateStart.push(moment(this.dateSelected).format('yyyy-MM-DD'))
          if (moment(this.dateReturnSelected).format('HH:mm:ss') > this.startTimeReturnRoute.startTime) {
            this.dateReturnSelected = moment(this.dateSelected).add(23, 'hours').toDate()
          }
          this.listDateStartReturn.push(moment(this.dateReturnSelected).format('yyyy-MM-DD'))
          // Set Time is start time for new date 
          this.dateSelected = moment(this.dateSelected).format('DD/MM/yyyy')
          this.dateSelected = moment(`${this.dateSelected} ${this.startTime.startTime}`, 'DD/MM/YYYY hh:mm:ss').toDate()
          this.dateReturnSelected = moment(this.dateSelected).format('DD/MM/yyyy')
          this.dateReturnSelected = moment(`${this.dateSelected} ${this.startTimeReturnRoute.startTime}`, 'DD/MM/YYYY hh:mm:ss').toDate()
        }
      }
      if (!this.selectReturnRoute) {
        this.listDateStartReturn = []
      }
      
      if(this.listDateStartReturn[0]){
        dateEnd = this.listDateStartReturn[this.listDateStartReturn.length - 1]
      }
      else{
        dateEnd = this.listDateStart[this.listDateStart.length - 1]
      }
      let request={
        dateStart:this.listDateStart[0],
        dateEnd:dateEnd
      }
      this.getBus(request.dateStart,request.dateEnd)
    }
   
  }
  getShuttle(routeId: any) {
    this.shuttleService.getShuttleByRoute(routeId).pipe(
      finalize(() => {
        let selectedShuttle = this.shuttles.find((item: any) => item.startTime === this.data.schedule.startTime);
        this.scheduleForm.get("startTime")?.setValue(selectedShuttle)
        this.startTime = selectedShuttle;
      })
    ).subscribe(
      data => {
        this.shuttles = data.data
        if (!this.data?.schedule) {
          this.scheduleForm.get("startTime")?.setValue(this.shuttles[0])
        }
        // this.schedule.startTime = this.shuttles[0];
      }
    )
  }
  getShuttleReturnRoute(routeId: any) {
    this.shuttleService.getShuttleByRoute(routeId).pipe()
      .subscribe(
        data => {
          this.shuttlesReturn = data.data
          this.scheduleForm.get("startTimeReturnRoute")?.setValue(this.shuttlesReturn[0])
          // this.schedule.startTime = this.shuttles[0];
          this.startTimeReturnRoute = this.shuttlesReturn[0]
        }
      )
  }

  getBusById(busId: any): boolean {
    let result: any
    result = this.buses.find(item => item.id === busId)
    return !!result
  }

  getBus(dateStart: any,dateEnd:any) {
    this.buses = []
    this.busService.getBusForDropDownByTravelDate(this.user.data?.id, dateStart, dateEnd).pipe(
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
  getReturnRoute(routeId: any) {
    let valuReturnRoute: any
    this.routeService.getReturnRoute(routeId).pipe(
      finalize(() => {
        this.scheduleForm.get("returnRoute")?.setValue(valuReturnRoute)
        this.scheduleForm.get("returnRoute")?.disable()
        this.getShuttleReturnRoute(this.returnRoute?.id)
      })
    ).subscribe(
      data => {
        this.returnRoute = data.data;
        valuReturnRoute = (`${this.returnRoute?.startPoint} - ${this.returnRoute?.endPoint}`)
      }
    )
  }
  onSubmit() {
    if (this.scheduleForm.valid) {
      this.createOrUpdate.emit({
        id: this.data.schedule?.id,
        busId: this.scheduleForm.value.busName?.id,
        shuttleReturnId:this.startTimeReturnRoute?.id,
        shuttleId: this.scheduleForm.value.startTime?.id,
        listDateStart: this.listDateStart,
        listDateStartReturn: this.listDateStartReturn,
        price: this.scheduleForm.value.price,
        eatingFee: this.scheduleForm.value.eatingFee
      });
    }
  }

}
