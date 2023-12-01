import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-parking',
  templateUrl: './dialog-parking.component.html',
  styleUrls: ['./dialog-parking.component.scss']
})
export class DialogParkingComponent implements OnInit {

  @Output() addParking = new EventEmitter<any>();
  constructor(private formBuilder: FormBuilder,) { 
  }
  ngOnInit(): void {
  }
  pakringForm = this.formBuilder.group({
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
    return this.pakringForm.get("pickUps") as FormArray;
  }
  get dropOffs() {
    return this.pakringForm.get("dropOffs") as FormArray;
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
  onSubmit(){
    if(this.pickUpForm.valid && this.dropOffForm.valid){
      this.addParking.emit({
        dropOffs:this.pakringForm.value.dropOffs,
        pickUps:this.pakringForm.value.pickUps
      })
    }
  }
}
