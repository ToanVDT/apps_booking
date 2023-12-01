import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { AuthenticationService } from '../../../../auth/service/authentication.service';
import { OrderShowInCustomerPage } from '../../../../brand-owner/model/order.model';
import { CustomerService } from '../../../service/customer.service';

@Component({
  selector: 'app-past-order',
  templateUrl: './past-order.component.html',
  styleUrls: ['./past-order.component.scss']
})
export class PastOrderComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'brandName',
    'tickets',
    'travelDate',
    'orderDate',
    'totalPrice',
    'deposit',
    'paymentStatus',
  ];
  today = new Date();
  customerInfo:boolean = true;
  user:any;
  noData:boolean = true;
  order:OrderShowInCustomerPage = {};
  orders:OrderShowInCustomerPage[]=[]
  isLoading : boolean = false;
  isApproval : boolean = true;

  dataSource = new MatTableDataSource(this.orders);
  dataSourceWithPageSize = new MatTableDataSource(this.orders);

  constructor( private auth:AuthenticationService,
    private customerService:CustomerService) {
    
    }
  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getCustomerOrder(this.user?.data?.id)
  }
 getCustomerOrder(userId:any){
  let response:any;
  this.customerService.getPastOrder(userId).pipe(
    finalize(()=>{
      if(response[0]?.id){
        this.noData = false;
        this.dataSource = new MatTableDataSource(this.orders)
        this.dataSource.paginator = this.paginator;
      }
      else{
        this.noData = true;
      }
      this.isLoading = false
    })
  ).subscribe(
    data=>{
      this.orders = data.data
      response = data.data
    }
  )
  }

}
