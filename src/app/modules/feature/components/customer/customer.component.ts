import { Component, OnInit } from '@angular/core';
import { popularRoute } from 'src/assets/data/popularRoute';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  popularRoute: any;
  constructor() { }

  ngOnInit(): void {
    this.popularRoute = popularRoute.slice(0, 5);
  }

}
