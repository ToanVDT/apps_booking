import { Component, EventEmitter, Inject, OnInit,Output } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-dialog-edit-shuttle",
  templateUrl: "./dialog-edit-shuttle.component.html",
  styleUrls: ["./dialog-edit-shuttle.component.scss"],
})
export class DialogEditShuttleComponent implements OnInit {
  shuttleForm: FormGroup;
  startTime: any;
  endTime: any;

  @Output() Update = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.shuttleForm = new FormGroup({
      startTime: new FormControl(this.startTime, [Validators.required]),
      endTime: new FormControl(this.endTime, [Validators.required]),
    });
  }

  ngOnInit(): void {
    console.log("dataRecieve",this.data)
    this.shuttleForm.get('startTime')?.valueChanges.subscribe(
      data=>{
        this.startTime = data
      }
    )
    this.shuttleForm.get('endTime')?.valueChanges.subscribe(
      data=>{
        this.endTime = data
      }
    )
    this.shuttleForm.get('startTime')?.setValue(this.data.shuttle.startTime)
    this.shuttleForm.get('endTime')?.setValue(this.data.shuttle.endTime)
  }
  onSubmit() {
    if(this.shuttleForm.valid){
      this.Update.emit({
        id:this.data.shuttle?.id,
        startTime:this.startTime,
        endTime:this.endTime
      })
    }
  }
}
