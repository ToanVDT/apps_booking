import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-customer-category-slider',
  templateUrl: './customer-category-slider.component.html',
  styleUrls: ['./customer-category-slider.component.scss']
})
export class CustomerCategorySliderComponent implements OnInit {
  @Input() title: any;
  @Input() categories: any;

  constructor() { }

  ngOnInit(): void {
  }

}
