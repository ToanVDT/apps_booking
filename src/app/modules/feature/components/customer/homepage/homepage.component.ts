import { Component, OnInit } from '@angular/core';
import { popularRoute } from 'src/assets/data/popularRoute';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {

  popularRoute: any;
  constructor() {}

  ngOnInit(): void {
      this.popularRoute = popularRoute.slice(0, 5);
  }
}
