import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { AuthenticationService } from 'src/app/modules/feature/components/auth/service/authentication.service';
import { DialogShowOrderComponent } from 'src/app/modules/feature/components/customer/components/dialog-show-order/dialog-show-order.component';
import { Router } from '@angular/router';
import { AppConstant } from 'src/app/modules/feature/components/common/constant';
import { DialogConfirmOrderComponent } from 'src/app/modules/feature/components/brand-owner/order/dialog-confirm-order/dialog-confirm-order.component';

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
    if(this.user?.success && this.user?.data.roles.includes(AppConstant.ROLE_CUSTOMER)){
      this.isLogin = true;
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
        if(this.user?.data.roles.includes(AppConstant.ROLE_CUSTOMER)){
          this.isLogin = data.isLoggedIn
        }
        else{
          this.isLogin = false;
        }
        if(this.isLogin){
          this.user?.data?.rankName ==='NEWMEMBER'? this.rank = 'Mới':
          this.user?.data?.rankName ==='MEMBER'? this.rank = 'Thường':
          this.user?.data?.rankName ==='VIPPER'? this.rank = 'Vip':''
        }
      }
    )
  }
  logout(){
   const dialogRef = this.dialog.open(DialogConfirmOrderComponent,{
    data:{name:"Đăng xuất"}
   })
   dialogRef.componentInstance.onConfirm.subscribe(()=>{
    this.handleLogOut()
   })
  }
  handleLogOut(){
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
  openPromotion(){
    this.router.navigate(['/customer/promotion'])
  }
}
