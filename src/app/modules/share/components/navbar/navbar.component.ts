import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from 'src/app/modules/feature/components/auth/service/authentication.service';
import { DialogShowOrderComponent } from 'src/app/modules/feature/components/customer/components/dialog-show-order/dialog-show-order.component';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogin!:boolean;
  user:any;
  constructor(private dialog:MatDialog,private auth:AuthenticationService) { }

  ngOnInit(): void {
    this.user = this.auth.userValue
    if(this.user.success){
      this.isLogin = true;
    }
    else{
      this.isLogin = false;
    }
  }
  openDialogLogin(){
    const dialogRef = this.dialog.open(LoginComponent,{
      width:'500px'
    })
    dialogRef.componentInstance.logInResponse.subscribe(
      data=>{
        this.isLogin = data.isLoggedIn
        // console.log(data)
      }
    )
  }
  logout(){
    this.isLogin = false;
    this.auth.logout()
  }
  openDialogShowOrder(){
    const dialogRef = this.dialog.open(DialogShowOrderComponent)
  }
}
