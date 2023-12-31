import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../../auth/service/authentication.service';
import { OrderService } from '../../../brand-owner/service/order.service';
import { ScheduleService } from '../../../brand-owner/service/schedule.service';
import { BrandOwnerDTO } from '../../model/admin.model';
import { DialogCreateUserComponent } from './dialog-create-user/dialog-create-user.component';
import { AdminService } from '../../service/admin.service';
import { finalize } from 'rxjs';
import { DialogConfirmOrderComponent } from '../../../brand-owner/order/dialog-confirm-order/dialog-confirm-order.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-manage-brand',
  templateUrl: './manage-brand.component.html',
  styleUrls: ['./manage-brand.component.scss']
})
export class ManageBrandComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'fullName',
    'info',
    'identityCode',
    'nameBrand',
    'addressBrand',
    'phoneBrand',
    'accountStatus',
    'action'
  ];
  noData: boolean = false
  brandOwners: BrandOwnerDTO[] = []
  brandOwner: BrandOwnerDTO = {}
  isLoading: boolean = false;
  statusForm:FormGroup;
  accountStatus:any[]=[
    {id:-1,name:"Tất cả"},
    {id:1,name:"Kích hoạt"},
    {id:0,name:"Vô hiệu hóa"},
  ]

  dataSource = new MatTableDataSource(this.brandOwners);
  dataSourceWithPageSize = new MatTableDataSource(this.brandOwners);

  constructor(private dialog: MatDialog, private adminService: AdminService,
    private message: ToastrService) {
      this.statusForm = new FormGroup({
        status: new FormControl("")
      })
  }
  ngOnInit(): void {
    this.getAllBrandOwner()
    this.statusForm.get("status")?.setValue(this.accountStatus[0])
    this.statusForm.get("status")?.valueChanges.subscribe(
      value=>{
        if(value?.id === this.accountStatus[0]?.id){
          this.getAllBrandOwner()
        }
        else{
          this.getAccountFilter(value?.id)
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
        this.getAllBrandOwner()
      })
    ).subscribe(
      response=>{
        if(response.success){
          this.message.success("Thêm tài khoản","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
  getAllBrandOwner() {
    this.isLoading = true;
    this.adminService.getAllCurrentBrand().pipe(
      finalize(() => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.brandOwners)
        this.dataSource.paginator = this.paginator;
      })
    ).subscribe(data => {
      this.brandOwners = data.data
    })
  }
  ActiveAccount(brandOwner: any) {
    const dialogRef = this.dialog.open(DialogConfirmOrderComponent, {
      data: { name: 'Kích hoạt tài khoản' }
    })
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.handleActiveAccount(brandOwner?.userId)
    }
    )
  }
  InativeAccount(brandOwner: any) {
    const dialogRef = this.dialog.open(DialogConfirmOrderComponent, {
      data: { name: 'Vô hiệu hóa tài khoản' }
    })
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.handleInactiveAccount(brandOwner?.userId)
    }
    )
  }
  handleActiveAccount(brandOwnerId: any) {
    this.isLoading = true;
    this.adminService.ActiveAccount(brandOwnerId).pipe(
      finalize(() => {
        this.message.success("Kích hoạt tài khoản", "Thành công", { timeOut: 2000, progressBar: true })
        this.getAllBrandOwner()
      })
    ).subscribe()
  }
  handleInactiveAccount(brandOwnerId: any) {
    this.isLoading = true;
    this.adminService.InactiveAccount(brandOwnerId).pipe(
      finalize(() => {
        this.message.success("Vô hiệu hóa tài khoản", "Thành công", { timeOut: 2000, progressBar: true })
        this.getAllBrandOwner()
      })
    ).subscribe()
  }
  getAccountFilter(activeCode:any){
    this.isLoading = true;
    this.adminService.getCurrentBrandFilter(activeCode).pipe(
      finalize(() => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.brandOwners)
        this.dataSource.paginator = this.paginator;
      })
    ).subscribe(data => {
      this.brandOwners = data.data
    })
  }
}
