import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-inform',
  templateUrl: './dialog-inform.component.html',
  styleUrls: ['./dialog-inform.component.scss']
})
export class DialogInformComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: { name: string }) {}

  ngOnInit(): void {
  }

}
