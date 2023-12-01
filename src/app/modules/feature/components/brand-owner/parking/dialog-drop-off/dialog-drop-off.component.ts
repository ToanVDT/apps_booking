import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ParkingService } from "../../service/parking.service";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-drop-off",
  templateUrl: "./dialog-drop-off.component.html",
  styleUrls: ["./dialog-drop-off.component.scss"],
})
export class DialogDropOffComponent implements OnInit {
  dropOffForm: FormGroup;
  provinces: any;
  dropOffPoint: any;
  dropOffTime: any;

  @Output() Update = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.dropOffForm = new FormGroup({
      dropOffPoint: new FormControl(this.dropOffPoint, [Validators.required]),
      dropOffTime: new FormControl(this.dropOffTime, [Validators.required]),
    });
  }

  ngOnInit(): void {
    this.dropOffForm.get("dropOffPoint")?.valueChanges.subscribe((data) => {
      this.dropOffPoint = data;
    });
    this.dropOffForm.get("dropOffTime")?.valueChanges.subscribe((data) => {
      this.dropOffTime = data;
    });
    if (this.data.dropOff) {
       this.dropOffForm.get("dropOffPoint")?.setValue(this.data.dropOff.dropOffPoint),
        this.dropOffForm.get("dropOffTime")?.setValue(this.data.dropOff.dropOffTime);
    }
  }
  onSubmit() {
    
    if (this.dropOffForm.valid) {
      this.Update.emit({
        dropOffId: this.data.dropOff?.id,
        dropOffPoint: this.dropOffPoint,
        dropOffTime: this.dropOffTime,
      });
    }
  }
}
