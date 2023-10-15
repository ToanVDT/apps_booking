import { Component, OnInit } from '@angular/core';
import { routes } from '../../../common/routes';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public routes: typeof routes = routes;
  constructor() { }

  ngOnInit(): void {
  }

}
