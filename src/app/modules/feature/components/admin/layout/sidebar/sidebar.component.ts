import { Component, OnInit } from '@angular/core';
import { routes } from '../../../common/routes';
import { AuthenticationService } from '../../../auth/service/authentication.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmOrderComponent } from '../../../brand-owner/order/dialog-confirm-order/dialog-confirm-order.component';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public routes: typeof routes = routes;
  constructor(private authService:AuthenticationService, private router:Router, private dialog:MatDialog) { }

  ngOnInit(): void {
  }
  logOut(){
    const dialogRef = this.dialog.open(DialogConfirmOrderComponent,{
      data:{
        name:"Đăng xuất"
      }
    })
    dialogRef.componentInstance.onConfirm.subscribe(()=>this.handleLogout())
  }
  handleLogout(){
    this.authService.logout();
    this.router.navigate(['/auth'])
  }

}
