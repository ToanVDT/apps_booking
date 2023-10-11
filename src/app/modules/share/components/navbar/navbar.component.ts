import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogin = false;
  constructor(private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  openDialogLogin(){
    const dialogRef = this.dialog.open(LoginComponent)
    dialogRef.componentInstance.logInResponse.subscribe(
      data=>{
        this.isLogin = data.isLoggedIn
        // console.log(data)
      }
    )
  }
  logout(){
    this.isLogin = false;
  }

}
