import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { RouteService } from '../../service/route.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-bus-dialog',
  templateUrl: './bus-dialog.component.html',
  styleUrls: ['./bus-dialog.component.scss']
})
export class BusDialogComponent implements OnInit {

  routeForm: FormGroup;
  provinces: any;
  bus:any; //bus
  startpoint: any;
  endpoint: any;
  indexend:any;
  indexStart:any;
  startPointSelected:any;
  endPointSelected:any;


  @Output() createOrUpdate = new EventEmitter<any>();

  constructor(
    private routeService: RouteService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.routeForm = new FormGroup({
      startPoint: new FormControl(this.startpoint, [Validators.required]),
      endPoint: new FormControl(this.endpoint, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.getProvices();
    this.routeForm.get("startPoint")?.valueChanges.subscribe((data) => {
      this.startpoint = data.name;
    });
    this.routeForm.get("endPoint")?.valueChanges.subscribe((data) => {
      this.endpoint = data.name;
    });
    console.log(this.data.route)
    // if (this.data.route) {
    //   this.routeForm.patchValue({
    //     startPoint: this.data.route?.startPoint,
    //     endPoint: this.data.route?.endPoint,
    //   });
    // }
  }
  getProvices() {
    this.routeService
      .getProvinces()
      .pipe()
      .subscribe((data) => {
        this.provinces = data;
        for (let i = 0; i < this.provinces.length; i++) {
          if (this.data.route?.endPoint == this.provinces[i].name) {
            this.indexend = i;
          }
          if (this.data.route?.startPoint == this.provinces[i].name) {
            this.indexStart = i;
          }
        }
        this.startPointSelected = this.provinces[this.indexStart];
        this.endPointSelected = this.provinces[this.indexend];
      }
    );
  }
  sendProvinces(value: any, check: boolean) {
    // if (check) {
    //   this.startPointSelected = value;
    // } else {
    //   this.endPointSelected = value;
    // }
  }
  onSubmit() {
    if (this.routeForm.valid) {
      this.createOrUpdate.emit({
        id: this.data.route?.id,
        startPoint: this.startpoint,
        endPoint: this.endpoint,
      });
    }
  }
}
