import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from 'src/app/modules/feature/components/auth/service/authentication.service';
import { DialogShowOrderComponent } from 'src/app/modules/feature/components/customer/components/dialog-show-order/dialog-show-order.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  isLogin!:boolean;
  user:any;
  rank:any
  constructor(private dialog:MatDialog,private auth:AuthenticationService,
    private router:Router) { }

  ngOnInit(): void {
    this.user = this.auth.userValue
    if(this.user?.success){
      this.isLogin = true;
      // console.log("rank", this.user?.data?.rankName)
       this.user?.data?.rankName ==='NEWMEMBER'? this.rank = 'Mới':
       this.user?.data?.rankName ==='MEMBER'? this.rank = 'Thường':
       this.user?.data?.rankName ==='VIPPER'? this.rank = 'Vip':''
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
        if(this.isLogin){
          this.user?.data?.rankName ==='NEWMEMBER'? this.rank = 'Mới':
          this.user?.data?.rankName ==='MEMBER'? this.rank = 'Thường':
          this.user?.data?.rankName ==='VIPPER'? this.rank = 'Vip':''
        }
      }
    )
  }
  logout(){
    this.isLogin = false;
    this.auth.logout()
    this.router.navigate(['/customer'])
  }
  openDialogShowOrder(){
    const dialogRef = this.dialog.open(DialogShowOrderComponent)
  }
  openProfileCustomer(){
    this.router.navigate(['/customer/profile-customer'])
  }
  openHistoryOrder(){
    this.router.navigate(['/customer/history-order'])
  }
}
