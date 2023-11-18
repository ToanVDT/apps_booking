import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../auth/service/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private auth:AuthenticationService) { }

  user:any;

  ngOnInit(): void {
    this.user = this.auth.userValue
  }
  logout():void{
    
  }
}
