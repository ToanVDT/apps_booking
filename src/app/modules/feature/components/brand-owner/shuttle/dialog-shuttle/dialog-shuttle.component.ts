import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { RouteService } from "../../service/route.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { Shuttle } from "../../model/shuttle.model";

@Component({
  selector: "app-dialog-shuttle",
  templateUrl: "./dialog-shuttle.component.html",
  styleUrls: ["./dialog-shuttle.component.scss"],
})
export class DialogShuttleComponent implements OnInit {
  routes: any;
  shuttle:Shuttle = {}
  routeId:any;
  pickUpData:any;
  startTime:any;
  endTime:any;
  dropOffData:any
  pickUpPoint: any
  pickUpTime: any

  @Output() createOrUpdate = new EventEmitter<any>();
  // pickUps: any;

  constructor(
    private routeService: RouteService,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
  }

  ngOnInit(): void {
    this.routes = this.data.routes

    this.shuttleForm.get("startPoint")?.valueChanges.subscribe((data) => {
      this.routeId = data;
    });
    this.shuttleForm.get("startTime")?.valueChanges.subscribe((data) => {
      this.startTime = data;
    });
    this.pickUpForm.get("pickUpPoint")?.valueChanges.subscribe((data)=>{
      // console.log("this.pickUpData.push(data)",this.pickUpData.push(data))
    })
    this.pickUpForm.get("pickUpTime")?.valueChanges.subscribe((data)=>{
      // console.log("pickTime",data)
    })
  }

  shuttleForm =this.formBuilder.group({
    startPoint: new FormControl("", [Validators.required]),
    startTime: new FormControl("", [Validators.required]),
    endTime: new FormControl("", [Validators.required]),
    pickUps: this.formBuilder.array([]),
    dropOffs: this.formBuilder.array([]),
  });

  pickUpForm = new FormGroup({
    pickUpPoint: new FormControl("", [Validators.required]),
    pickUpTime: new FormControl("", [Validators.required]),
  });

  dropOffForm = this.formBuilder.group({
    dropOffPoint: new FormControl("", [Validators.required]),
    dropOffTime: new FormControl("", [Validators.required]),
  });

  get pickUps() {
    return this.shuttleForm.get("pickUps") as FormArray;
  }
  get dropOffs() {
    return this.shuttleForm.get("dropOffs") as FormArray;
  }

  addNewPickUp() {
    this.pickUpForm = new FormGroup({
      pickUpPoint: new FormControl("", [Validators.required]),
      pickUpTime: new FormControl("", [Validators.required]),
    });
    this.pickUps.push(this.pickUpForm);
  }
  onRemovePickUp(index:any){
    this.pickUps.removeAt(index);
  }
  onRemoveDropOff(index:any){
    this.dropOffs.removeAt(index);
  }
  addNewDropOff() {
    this.dropOffForm = this.formBuilder.group({
      dropOffPoint: new FormControl("", [Validators.required]),
      dropOffTime: new FormControl("", [Validators.required]),
    });
    this.dropOffs.push(this.dropOffForm);
  }
  onSubmit() {
    if (this.shuttleForm.valid) {
      // console.log("value", this.shuttleForm.value)
      this.createOrUpdate.emit({
        id: this.data.shuttle?.id,
        startTime:this.shuttleForm.value.startTime,
        endTime:this.shuttleForm.value.endTime,
        routeId:this.routeId.id,
        dropOffs:this.shuttleForm.value.dropOffs,
        pickUps:this.shuttleForm.value.pickUps
      });
    }
  }
}
