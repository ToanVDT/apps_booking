import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-confirm-dialog",
  templateUrl: "./confirm-dialog.component.html",
  styleUrls: ["./confirm-dialog.component.scss"],
})
export class ConfirmDialogComponent implements OnInit {
  @Output() onConfirm = new EventEmitter<any>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) {}

  ngOnInit(): void {}

  confirm() {
    this.onConfirm.emit();
  }
}
