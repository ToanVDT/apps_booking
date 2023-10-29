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

  buses: Bus[] = [];
shuttle: Shuttle = {};
shuttles: Shuttle[] = [];
scheduleForm: FormGroup;
schedule: Schedule = {};
routes: any;

@Output() createOrUpdate = new EventEmitter<any>();

constructor(
  private routeService: RouteService,
  private shuttleService: ShuttleService,
  @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.scheduleForm = new FormGroup({
    routeName: new FormControl(this.schedule.routeName, [Validators.required]),
    busName: new FormControl(this.schedule.busName, [Validators.required]),
    startTime: new FormControl(this.schedule.startTime, [Validators.required]),
    dateStart: new FormControl(this.schedule.dateStart, [Validators.required]),
    price: new FormControl(this.schedule.price, [Validators.required]),
    eatingFee: new FormControl(this.schedule.eatingFee, [Validators.required]),
  });
}

ngOnInit(): void {
  this.buses = this.data.bus;
  this.routes = this.data.routes;
  this.getShuttle(this.data.routeId);
  // Subscribe to form values
  // ... (omitted for brevity)

  // Fill form with existing data if available
  if (this.data.schedule) {
    // ... (omitted for brevity)
  }
}

getShuttle(routeId: any) {
  this.shuttleService.getShuttleByRoute(routeId).pipe().subscribe(
    data => {
      this.shuttles = data.data;
    }
  );
}

onSubmit() {
  if (this.scheduleForm.valid) {
    // Emit the form data to the parent component
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
