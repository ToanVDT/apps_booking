import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { RouteService } from "../../service/route.service";
import { Provinces, ProvinesCustom, Routes } from "../../model/route.model";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-create-update-route",
  templateUrl: "./dialog-create-update-route.component.html",
  styleUrls: ["./dialog-create-update-route.component.scss"],
})
export class DialogCreateUpdateRouteComponent implements OnInit {
  routeForm: FormGroup;
  provinces: Provinces[]=[];
  province:Provinces={}
  provincesCustoms:ProvinesCustom[]=[]
  provincesCustom:ProvinesCustom={}
  route!: Routes;
  startpoint: any;
  endpoint: any;
  indexend: any;
  indexStart: any;
  startPointSelected: any;
  endPointSelected: any;

  @Output() createOrUpdate = new EventEmitter<any>();

  constructor( @Inject(MAT_DIALOG_DATA) public data: any
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
  }
  getProvices() {
    this.provinces = this.data.provinces;
    this.provincesCustoms = this.provinces.map(({code,codename,districts,division_type,phone_code,...name})=>name)
    this.provincesCustoms.map((item)=>{
      if(item.name?.startsWith("Tỉnh")){
       item.name = item.name.substring(5)
      }
    })
    if (this.data.route?.id) {
      let selectedStartPoint = this.provincesCustoms.find((item: any) => item.name === this.data.route.startPoint);
      let selectedEndPoint = this.provincesCustoms.find((item: any) => item.name === this.data.route.endPoint);
      this.routeForm.get("startPoint")?.setValue(selectedStartPoint);
      this.routeForm.get("endPoint")?.setValue(selectedEndPoint);
    }
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
