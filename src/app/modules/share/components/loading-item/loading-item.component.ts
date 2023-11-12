import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading-item',
  templateUrl: './loading-item.component.html',
  styleUrls: ['./loading-item.component.scss']
})
export class LoadingItemComponent implements OnInit {

  @Input() isLoading:any;
  constructor() { }

  ngOnInit(): void {
  }

}
