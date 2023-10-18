import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-category-card',
  templateUrl: './customer-category-card.component.html',
  styleUrls: ['./customer-category-card.component.scss']
})
export class CustomerCategoryCardComponent implements OnInit {
  @Input() category: any;
  constructor() { }

  ngOnInit(): void {
  }

}
