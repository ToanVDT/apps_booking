import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin } from 'rxjs';
import { AuthenticationService } from '../../../../auth/service/authentication.service';
import { DetailMoney, DateAndTime, DetailInfoCustomer, Orders, OrderShowInCustomerPage } from '../../../../brand-owner/model/order.model';
import { ScheduleDTO } from '../../../../brand-owner/model/schedule.model';
import { Shuttle } from '../../../../brand-owner/model/shuttle.model';
import { DialogConfirmOrderComponent } from '../../../../brand-owner/order/dialog-confirm-order/dialog-confirm-order.component';
import { DialogDepositOrderComponent } from '../../../../brand-owner/order/dialog-deposit-order/dialog-deposit-order.component';
import { DialogDetailComponent } from '../../../../brand-owner/order/dialog-detail/dialog-detail.component';
import { DialogInformComponent } from '../../../../brand-owner/order/dialog-inform/dialog-inform.component';
import { OrderService } from '../../../../brand-owner/service/order.service';
import { ScheduleService } from '../../../../brand-owner/service/schedule.service';

@Component({
  selector: 'app-current-order',
  templateUrl: './current-order.component.html',
  styleUrls: ['./current-order.component.scss']
})
export class CurrentOrderComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'brandName',
    'tickets',
    'orderDate',
    'totalPrice',
    'deposit',
    'orderStatus',
    'paymentStatus',
    'action'
  ];
  today = new Date();
  status = ["Đã đặt", "Đã hủy", "Chờ duyệt"]
  shuttle : Shuttle = {}
  detailMoney:DetailMoney= {};
  openingMenu:boolean = false;
  dateTime:DateAndTime = {}
  detailInfoCustomer:DetailInfoCustomer ={}
  customerInfo:boolean = true;
  user:any;
  timeValidToCancelBooking:boolean = true;
  noData:boolean = true;
  order:OrderShowInCustomerPage = {};
  orders:OrderShowInCustomerPage[]=[]
  isLoading : boolean = false;
  isApproval : boolean = true;
  schedules:ScheduleDTO[]=[];
  schedule:ScheduleDTO ={}
  orderForm:FormGroup

  dataSource = new MatTableDataSource(this.orders);
  dataSourceWithPageSize = new MatTableDataSource(this.orders);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private scheduleService:ScheduleService,private orderService:OrderService,
    private message:ToastrService) {
      this.orderForm = new FormGroup({
        schedule:new FormControl(""),
        dateStart:new FormControl("")
      })
    }
  ngOnInit(): void {
    this.user = this.auth.userValue;
  }
 getOrders(userId:any){
  // let response:any;
  // this.orderService.getOrderInSchedule(scheduleId).pipe(
  //   finalize(()=>{
  //     if(response[0]?.id){
  //       this.noData = false;
  //       this.dataSource = new MatTableDataSource(this.orders)
  //       this.dataSource.paginator = this.paginator;
  //     }
  //     else{
  //       this.noData = true;
  //     }
  //     this.isLoading = false
  //   })
  // ).subscribe(
  //   data=>{
  //     this.orders = data.data
  //     response = data.data
  //     this.orders.map((item)=>{
  //       if(item.orderStatus === "ORDERED"){
  //         item.orderStatus = this.status[0]
  //       }
  //       else if (item.orderStatus === "CANCELED"){
  //         item.orderStatus = this.status[1]
  //       }
  //       else{
  //         item.orderStatus = this.status[2]
  //       }
  //     })

  //   }
  // )
 }
  getOrder(order:any){
    this.openingMenu = true;
    this.getDetailOrderAndDateTime(order);
  }
  CancelBooking(order:any){
    if(!this.timeValidToCancelBooking){
      this.dialog.open(DialogInformComponent,{
        data:{
          name:'Chỉ được hủy đơn đặt vé trước 2 tiếng trước giờ xe chạy!'
        }})
    }
    else{
      const dialogRef = this.dialog.open(DialogConfirmOrderComponent,{
        data:{name:'Hủy đơn đặt'}
      })
      dialogRef.componentInstance.onConfirm.subscribe(()=>
      {

        this.handleCancelBooking(order?.id)
      }
      )
    }
  }
  openOrderDetail(order:any){
    // const dialogRef = this.dialog.open(DialogDetailComponent,{
    //   data:{
    //     detailMoney:this.detailMoney,
    //     detailInfoCustomer:this.detailInfoCustomer
    //   }
    // })
  }

  getDetailOrderAndDateTime(order:any){
    forkJoin({
      detailOrder:this.getDetailOderByOrderCode(order?.orderCode),
      dateAndTime:this.getDateAndTime(order?.id)
    }).pipe(
      finalize(()=>{
        let dateCancelBooking = moment(this.today).format('yyyy-MM-DD');
        let timeCancelBooking = moment(this.today).add(2,'hours').format('hh:mm')
        // console.log("today", dateCancelBooking, timeCancelBooking)
        // let dateCancelBooking = '2023-11-03'
        // // time 12:30
        // let timeCancelBooking = '15:30'
        if(this.dateTime?.date < dateCancelBooking){
          this.timeValidToCancelBooking = false;
        }
        else if(this.dateTime?.date == dateCancelBooking && this.dateTime?.time < timeCancelBooking){
          this.timeValidToCancelBooking = false;
        }
        else{
          this.timeValidToCancelBooking = true;
        }
        this.openingMenu = false;
      })
    ).subscribe(
      data=>{

        this.dateTime = data.dateAndTime.data
      }
    )
  }
  getDetailOderByOrderCode(orderCode:any){
    return this.orderService.getOrderByOrderCode(orderCode).pipe()
  }
  getDateAndTime(orderId:any){
    return this.orderService.getDateAndTimeByOrder(orderId).pipe()
  }
  handleCancelBooking(orderId:any){
    this.isLoading = true;
    this.orderService.cancelTicket(orderId).pipe(
      finalize(()=>{
        this.message.success("Hủy đơn đặt vé","Thành công",{timeOut:2000, progressBar:true})
        this.getOrders(this.schedule?.id)
      })
    ).subscribe()
  }
}
