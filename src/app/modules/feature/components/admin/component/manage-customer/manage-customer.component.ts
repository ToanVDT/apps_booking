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
import { FormControl, FormGroup } from '@angular/forms';

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
  rankForm:FormGroup
  accountRank:any[]=[
    {id:0,name:"Tất cả"},
    {id:1,name:"Thành viên mới"},
    {id:2,name:"Thành viên thường"},
    {id:3,name:"Thành viên vip"},
  ]

  dataSource = new MatTableDataSource(this.customers);
  dataSourceWithPageSize = new MatTableDataSource(this.customers);

  constructor(private dialog: MatDialog, private adminService: AdminService,
    private message: ToastrService) {
      this.rankForm = new FormGroup({
        rank: new FormControl("")
      })
  }
  ngOnInit(): void {
    this.getAllCustomer()
    this.rankForm.get("rank")?.setValue(this.accountRank[0])
    this.rankForm.get("rank")?.valueChanges.subscribe(
      value=>{
        if(value === this.accountRank[0]){
          this.getAllCustomer()
        }
        else{
          this.getCustomerByFilterRank(value?.id)
        }
      }
    )
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
  getCustomerByFilterRank(rankId:any){
    let response:any
    this.isLoading = true;
    this.adminService.getCustomerByFilterRank(rankId).pipe(
      finalize(() => {
        if(response[0]?.customerId){
          this.noData = false
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.customers)
          this.dataSource.paginator = this.paginator;
        }
        else{
          this.noData = true;
          this.isLoading = false;
        }
      })
    ).subscribe(data => {
      this.customers = data.data
      response = this.customers
    })
  }
}
