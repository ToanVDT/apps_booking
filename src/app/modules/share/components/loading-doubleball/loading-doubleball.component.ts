import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-doubleball',
  templateUrl: './loading-doubleball.component.html',
  styleUrls: ['./loading-doubleball.component.scss']
})
export class LoadingDoubleballComponent implements OnInit {
  @Input() isLoading:any;
  constructor() { }

  ngOnInit(): void {
  }

}
