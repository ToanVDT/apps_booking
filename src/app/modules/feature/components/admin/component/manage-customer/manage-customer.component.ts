import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs';
import { DialogConfirmOrderComponent } from '../../../brand-owner/order/dialog-confirm-order/dialog-confirm-order.component';
import { BrandOwnerDTO, CustomerDTO } from '../../model/admin.model';
import { AdminService } from '../../service/admin.service';
import { DialogCreateUserComponent } from '../manage-brand/dialog-create-user/dialog-create-user.component';

@Component({
  selector: 'app-manage-customer',
  templateUrl: './manage-customer.component.html',
  styleUrls: ['./manage-customer.component.scss']
})
export class ManageCustomerComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'fullName',
    'phone',
    'email',
    'rank',
    'action'
  ];
  noData: boolean = false
  customers: CustomerDTO[] = []
  customer: CustomerDTO = {}
  isLoading: boolean = false;

  dataSource = new MatTableDataSource(this.customers);
  dataSourceWithPageSize = new MatTableDataSource(this.customers);

  constructor(private dialog: MatDialog, private adminService: AdminService,
    private message: ToastrService) {

  }
  ngOnInit(): void {
    this.getAllCustomer()
  }

  openDialogCreateUser() {
    let dialogRef = this.dialog.open(DialogCreateUserComponent, { width: '500px' })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateBrandOwnerAccount(data)
      }
    )
  }
  handleCreateBrandOwnerAccount(request:any){
    this.isLoading = true
    this.adminService.createAccountBrandOwner(request).pipe(
      finalize(()=>{
        this.getAllCustomer()
      })
    ).subscribe(
      response=>{
        if(response.success){
          this.message.success("Thêm tài khoản","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
  getAllCustomer() {
    this.isLoading = true;
    this.adminService.getAllCustomer().pipe(
      finalize(() => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.customers)
        this.dataSource.paginator = this.paginator;
      })
    ).subscribe(data => {
      this.customers = data.data
      console.log(this.customers)
    })
  }

  deleteCustomer(customer:any){
    let customerName = "Xóa khách hàng "+ customer?.fullName;
    const dialigRef = this.dialog.open(DialogConfirmOrderComponent,{
      data:{name:customerName}
    })
    dialigRef.componentInstance.onConfirm.subscribe(()=>{
      this.handleDeleteCustomer(customer?.customerId)
    })
  }
  handleDeleteCustomer(customerId:any){
    this.isLoading = true;
    this.adminService.deleteCustomer(customerId).pipe(
      finalize(()=>{
        this.getAllCustomer()
        this.message.success("Xóa khách hàng", "Thành công",{timeOut:2000,progressBar:true})
      })
    ).subscribe()
  }

}
