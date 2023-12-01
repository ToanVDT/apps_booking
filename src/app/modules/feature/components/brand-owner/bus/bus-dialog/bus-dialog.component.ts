import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { RouteService } from '../../service/route.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Bus } from '../../model/bus.model';
import { BusService } from '../../service/bus.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-bus-dialog',
  templateUrl: './bus-dialog.component.html',
  styleUrls: ['./bus-dialog.component.scss']
})
export class BusDialogComponent implements OnInit {

  busForm: FormGroup;
  bus:Bus={}; 
  typeBuses:any;
  duplicateNameBus!:boolean;
  duplicateIdentityCode!:boolean;
  existName: any;
  existIdentityCode:any;

  @Output() createOrUpdate = new EventEmitter<any>();

  constructor(
    private busService:BusService,
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
    this.typeBuses = this.data.type
    this.busForm.get("busType")?.valueChanges.subscribe((data) => {
      this.bus.busType = data;
    });
    this.busForm.get("description")?.valueChanges.subscribe((data) => {
      this.bus.description = data;
    });
    this.busForm.get("identityCode")?.valueChanges.pipe(debounceTime(800), distinctUntilChanged()).subscribe((data) => {
      this.bus.identityCode = data;
      if(data !== this.existIdentityCode){
        if(data){
          this.checkDuplicateIdentityCode(data)
        }
      }
    });
    this.busForm.get("name")?.valueChanges.pipe(debounceTime(700), distinctUntilChanged()).subscribe((data) => {
      this.bus.name = data;
      if (data !== this.existName) {
        if(data){
          this.checkDuplicateBusName(data)
        }
      }
    });
    this.busForm.get("seats")?.valueChanges.subscribe((data) => {
      this.bus.seats = data;
    });
   if(this.data.bus){
    this.existName = this.data.bus.name
    this.existIdentityCode = this.data.bus.identityCode
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
  checkDuplicateBusName(name:any){
    this.busService.checkDuplicateBusName(name).pipe().subscribe(
      data=>{
        this.duplicateNameBus = data
        if(data){
          this.busForm.get('name')?.setErrors({duplicateNameBus:true})
        }
      }
    )
  }
  checkDuplicateIdentityCode(identityCode:any){
    this.busService.checkDuplicateIdentityCode(identityCode).pipe().subscribe(
      data=>{
        this.duplicateIdentityCode = data
        if(data){
          this.busForm.get('identityCode')?.setErrors({duplicateIdentityCode:true})
        }
      }
    )
  }
}
