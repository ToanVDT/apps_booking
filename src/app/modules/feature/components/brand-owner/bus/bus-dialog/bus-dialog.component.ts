import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { RouteService } from '../../service/route.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Bus } from '../../model/bus.model';

@Component({
  selector: 'app-bus-dialog',
  templateUrl: './bus-dialog.component.html',
  styleUrls: ['./bus-dialog.component.scss']
})
export class BusDialogComponent implements OnInit {

  busForm: FormGroup;
  bus:Bus={}; 
  typeBuses:any;

  @Output() createOrUpdate = new EventEmitter<any>();

  constructor(
    private routeService: RouteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.busForm = new FormGroup({
      busType: new FormControl(this.bus.busType, [Validators.required]),
      description: new FormControl(this.bus.description),
      identityCode: new FormControl(this.bus.identityCode, [Validators.required]),
      name: new FormControl(this.bus.name, [Validators.required]),
      seats: new FormControl(this.bus.seats, [Validators.required, Validators.pattern("^[0-9]*$")]),
    });
  }

  ngOnInit(): void {
    // console.log("data", this.data)
    this.typeBuses = this.data.type
    this.busForm.get("busType")?.valueChanges.subscribe((data) => {
      this.bus.busType = data;
    });
    this.busForm.get("description")?.valueChanges.subscribe((data) => {
      this.bus.description = data;
    });
    this.busForm.get("identityCode")?.valueChanges.subscribe((data) => {
      this.bus.identityCode = data;
    });
    this.busForm.get("name")?.valueChanges.subscribe((data) => {
      this.bus.name = data;
    });
    this.busForm.get("seats")?.valueChanges.subscribe((data) => {
      this.bus.seats = data;
    });
   if(this.data.bus){
    let selectedBusType = this.typeBuses.find((item: any) => item.type === this.data.bus.busType);
    this.busForm.get("busType")?.setValue(selectedBusType)
    this.busForm.get("description")?.setValue(this.data.bus.description)
    this.busForm.get("identityCode")?.setValue(this.data.bus.identityCode)
    this.busForm.get("name")?.setValue(this.data.bus.name)
    this.busForm.get("seats")?.setValue(this.data.bus.seats)
   }
  }
  onSubmit() {
    if (this.busForm.valid) {
      this.createOrUpdate.emit({
        id: this.data.bus?.id,
        typeId: this.bus.busType?.id,
        description: this.bus.description,
        identityCode: this.bus.identityCode,
        name: this.bus.name,
        seats: this.bus.seats,
      });
    }
  }
}
