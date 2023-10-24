import { Component, OnInit } from '@angular/core';
import { filters, singleFilter } from 'src/assets/data/filterData';

@Component({
  selector: 'app-list-result-shuttle',
  templateUrl: './list-result-shuttle.component.html',
  styleUrls: ['./list-result-shuttle.component.scss']
})
export class ListResultShuttleComponent implements OnInit {

  singleFilterData: any;
  filterData: any;

  constructor() {}

  ngOnInit(): void {
      this.singleFilterData = singleFilter;
      this.filterData = filters;
  }
}
