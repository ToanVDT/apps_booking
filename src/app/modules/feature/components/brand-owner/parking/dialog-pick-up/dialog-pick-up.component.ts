import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-pick-up',
  templateUrl: './dialog-pick-up.component.html',
  styleUrls: ['./dialog-pick-up.component.scss']
})
export class DialogPickUpComponent implements OnInit {

  pickUpForm: FormGroup;
  provinces: any;
  pickUpPoint: any;
  pickUpTime: any;

  @Output() Update = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.pickUpForm = new FormGroup({
      pickUpPoint: new FormControl(this.pickUpPoint, [Validators.required]),
      pickUpTime: new FormControl(this.pickUpTime, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.pickUpForm.get("pickUpPoint")?.valueChanges.subscribe((data) => {
      this.pickUpPoint = data;
    });
    this.pickUpForm.get("pickUpTime")?.valueChanges.subscribe((data) => {
      this.pickUpTime = data;
    });
    if (this.data.pickUp) {
       this.pickUpForm.get("pickUpPoint")?.setValue(this.data.pickUp.pickUpPoint),
        this.pickUpForm.get("pickUpTime")?.setValue(this.data.pickUp.pickUpTime);
    }
  }
  onSubmit() {
    
    if (this.pickUpForm.valid) {
      this.Update.emit({
        id: this.data.pickUp?.id,
        pickUpPoint: this.pickUpPoint,
        pickUpTime: this.pickUpTime,
      });
    }
  }
}
