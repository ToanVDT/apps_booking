import { Component, OnInit } from '@angular/core';
import { routes } from '../../../common/routes';
import { AuthenticationService } from '../../../auth/service/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public routes: typeof routes = routes;
  constructor(private authService:AuthenticationService, private router:Router) { }

  ngOnInit(): void {
  }
  logOut(){
    this.authService.logout();
    this.router.navigate(['/auth'])
  }

}
