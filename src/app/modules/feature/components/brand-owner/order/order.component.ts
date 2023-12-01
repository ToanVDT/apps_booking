import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin } from 'rxjs';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { ScheduleDTO } from '../model/schedule.model';
import { Shuttle } from '../model/shuttle.model';
import { ScheduleService } from '../service/schedule.service';
import { Routes } from '../model/route.model';
import * as moment from 'moment';
import { DetailMoney, DateAndTime, DetailInfoCustomer, Orders } from '../model/order.model';
import { OrderService } from '../service/order.service';
import { DialogConfirmOrderComponent } from './dialog-confirm-order/dialog-confirm-order.component';
import { DialogDepositOrderComponent } from './dialog-deposit-order/dialog-deposit-order.component';
import { DialogInformComponent } from './dialog-inform/dialog-inform.component';
import { DialogDetailComponent } from './dialog-detail/dialog-detail.component';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'orderCode',
    'tickets',
    'orderDate',
    'totalPrice',
    'deposit',
    'orderStatus',
    'paymentStatus',
    'action'
  ];
  today = new Date();
  status = ["Đã đặt", "Đã hủy", "Chờ duyệt", "Hoàn thành"]
  routes: Routes[] = [];
  route: Routes = {};
  shuttle: Shuttle = {}
  detailMoney: DetailMoney = {};
  openingMenu: boolean = false;
  dateTime: DateAndTime = {}
  detailInfoCustomer: DetailInfoCustomer = {}
  customerInfo: boolean = true;
  user: any;
  totalMoney: number = 0;
  timeValidToCancelBooking: boolean = true;
  noData: boolean = true;
  order: Orders = {};
  orders: Orders[] = []
  isLoading: boolean = false;
  isApproval: boolean = true;
  schedules: ScheduleDTO[] = [];
  schedule: ScheduleDTO = {}
  orderForm: FormGroup
  orderFilter = null;
  paymentFilter = null;
  orderStatus: any[] = [
    { id: "ALL", name: "Tất cả" },
    { id: "ORDERED", name: "Đã đặt" },
    { id: "PENDING", name: "Chờ duyệt" },
    { id: "CANCELED", name: "Đã hủy" },
    { id: "COMPLETED", name: "Hoàn thành" },
  ]
  paymentStatus: any[] = [
    { id: 2, name: "Tất cả" },
    { id: 0, name: "Chưa thanh toán" },
    { id: 1, name: "Đã thanh toán" },
    { id: 3, name: "Đã cọc" },
  ]

  dataSource = new MatTableDataSource(this.orders);
  dataSourceWithPageSize = new MatTableDataSource(this.orders);

  constructor(private dialog: MatDialog, private auth: AuthenticationService,
    private scheduleService: ScheduleService, private orderService: OrderService,
    private message: ToastrService) {
    this.orderForm = new FormGroup({
      schedule: new FormControl(""),
      dateStart: new FormControl(""),
      statusPayment: new FormControl(""),
      statusOrder: new FormControl("")
    })
  }
  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.orderForm.get("dateStart")?.valueChanges.subscribe((value) => {
      this.getScheduleByTravelDate(value)
    });
    this.orderForm.get("schedule")?.valueChanges.subscribe(
      (value) => {
        this.schedule = value;
        this.getOrdersAndTotalMoney(this.schedule?.id)
      }
    )
    let todayFormat = moment(this.today).format('yyyy-MM-DD');
    this.orderForm.get("dateStart")?.setValue(todayFormat)
    this.orderForm.get("statusOrder")?.setValue(this.orderStatus[0])
    this.orderForm.get("statusPayment")?.setValue(this.paymentStatus[0])
    this.orderForm.get("statusOrder")?.valueChanges.subscribe(
      value=>{
        if(value?.id ==="ALL"){
          this.orderFilter = null;
        }
        else{
          this.orderFilter = value?.id
        }
        this.getOrderFilter(this.schedule?.id,this.paymentFilter, this.orderFilter)
      }
    )
    this.orderForm.get("statusPayment")?.valueChanges.subscribe(
      value=>{
        if(value?.id === 2){
          this.paymentFilter = null;
        }
        else{
          this.paymentFilter = value?.id
        }
        this.getOrderFilter(this.schedule?.id,this.paymentFilter, this.orderFilter)
      }
    )
  }
  getOrdersAndTotalMoney(scheduleId: any) {
    let response: any;
    forkJoin({
      orders: this.getOrders(scheduleId),
      money: this.getMoney(scheduleId)
    }).pipe(
      finalize(() => {
        if (response[0]?.id) {
          this.noData = false;
          this.dataSource = new MatTableDataSource(this.orders)
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.noData = true;
        }
        this.isLoading = false
      })
    ).subscribe(
      data => {
        this.orders = data.orders.data
        response = data.orders.data
        this.totalMoney = data.money.data
        this.orders.map((item) => {
          if (item.orderStatus === "ORDERED") {
            item.orderStatus = this.status[0]
          }
          else if (item.orderStatus === "CANCELED") {
            item.orderStatus = this.status[1]
          }
          else if (item.orderStatus === 'PENDING') {
            item.orderStatus = this.status[2]
          }
          else {
            item.orderStatus = this.status[3]
          }
        })

      }
    )
  }
  getMoney(scheduleId: any) {
    return this.orderService.getTotalMoneyOrder(scheduleId).pipe()
  }
  getOrders(scheduleId: any) {
    return this.orderService.getOrderInSchedule(scheduleId).pipe()
  }
  getScheduleByTravelDate(dateStart: any) {
    let value: any;
    this.isLoading = true;
    this.scheduleService.getScheduleByTravelDate(dateStart, this.user?.data?.id).pipe(
      finalize(() => {

        if (value[0]?.id) {
          this.noData = false;
          this.orderForm.get("schedule")?.setValue(this.schedules[0])
        }
        else {
          this.noData = true;
          this.isLoading = false;
        }
      })
    ).subscribe(
      data => {
        this.schedules = data
        value = data;
      }
    )
  }
  getOrderId(order: any) {
    this.openingMenu = true;
    this.getDetailMoneyAndInfoCustomerAndDateTimeWithOrderId(order?.id);
  }
  ApprovalOrder(order: any) {
    this.isLoading = true;
    this.orderService.approvalOrder(order?.id).pipe(
      finalize(() => {
        this.message.success("Duyệt đơn đặt vé", "Thành công", { timeOut: 2000, progressBar: true })
        this.getOrders(this.schedule?.id)
      })
    ).subscribe()
  }
  CancelBooking(order: any) {
    if (!this.timeValidToCancelBooking) {
      this.dialog.open(DialogInformComponent, {
        data: {
          name: 'Chỉ được hủy đơn đặt vé trước 2 tiếng trước giờ xe chạy!'
        }
      })
    }
    else {
      const dialogRef = this.dialog.open(DialogConfirmOrderComponent, {
        data: { name: 'Hủy đơn đặt' }
      })
      dialogRef.componentInstance.onConfirm.subscribe(() => {
        this.handleCancelBooking(order?.id)
      }
      )
    }
  }
  openOrderDetail(order: any) {
    const dialogRef = this.dialog.open(DialogDetailComponent, {
      data: {
        detailMoney: this.detailMoney,
        detailInfoCustomer: this.detailInfoCustomer
      }
    })
  }
  getOrderFilter(scheduleId: any, isPaid: any, status: any) {
    this.isLoading = true
    let response:any
    let request = { scheduleId: scheduleId, isPaid: isPaid, status: status }
    this.orderService.getOrderFilter(request).pipe(
      finalize(() => {
        if (response[0]?.id) {
          this.noData = false;
          this.dataSource = new MatTableDataSource(this.orders)
          this.dataSource.paginator = this.paginator;
        }
        else {
          this.noData = true;
        }
        this.isLoading = false
      })
    ).subscribe(
      data => {
        this.orders = data.data
        response = data.data
        console.log("order", data.data)
        this.orders.map((item) => {
          if (item.orderStatus === "ORDERED") {
            item.orderStatus = this.status[0]
          }
          else if (item.orderStatus === "CANCELED") {
            item.orderStatus = this.status[1]
          }
          else if (item.orderStatus === 'PENDING') {
            item.orderStatus = this.status[2]
          }
          else {
            item.orderStatus = this.status[3]
          }
        })
      }
    )
  }

  getDetailMoneyAndInfoCustomerAndDateTimeWithOrderId(orderId: any) {
    forkJoin({
      detailMoney: this.getDetailMoney(orderId),
      detailInfoCustomer: this.getDetailInfoCustomer(orderId),
      dateAndTime: this.getDateAndTime(orderId)
    }).pipe(
      finalize(() => {
        let dateCancelBooking = moment(this.today).format('yyyy-MM-DD');
        let timeCancelBooking = moment(this.today).add(2, 'hours').format('HH:mm')
        // console.log("today", dateCancelBooking, timeCancelBooking)
        // let dateCancelBooking = '2023-11-03'
        // // time 12:30
        // let timeCancelBooking = '15:30'
        if (this.dateTime?.date < dateCancelBooking) {
          this.timeValidToCancelBooking = false;
        }
        else if (this.dateTime?.date == dateCancelBooking && this.dateTime?.time < timeCancelBooking) {
          this.timeValidToCancelBooking = false;
        }
        else {
          this.timeValidToCancelBooking = true;
        }
        this.openingMenu = false;
      })
    ).subscribe(
      data => {
        this.detailMoney = data.detailMoney.data
        this.detailInfoCustomer = data.detailInfoCustomer.data
        this.dateTime = data.dateAndTime.data
      }
    )
  }
  getDetailMoney(orderId: any) {
    return this.orderService.getDetailMonerByOrder(orderId).pipe()
  }
  getDetailInfoCustomer(orderId: any) {
    return this.orderService.getInfoCustomerByOrder(orderId).pipe()
  }
  getDateAndTime(orderId: any) {
    return this.orderService.getDateAndTimeByOrder(orderId).pipe()
  }
  confirmPaid(order: any) {
    const dialogRef = this.dialog.open(DialogConfirmOrderComponent, {
      data: { name: 'Đơn đặt đã thanh toán' }
    })
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.handleConfirmPaid(order?.id)
    })
  }
  openDialogEnterDeposit(order: any) {
    const dialogRef = this.dialog.open(DialogDepositOrderComponent, {
      data: { order: order }
    })
    dialogRef.componentInstance.updateDeposit.subscribe(
      data => {
        this.handleUpdateEnterDeposit(data.orderId, data.deposit)
      }
    )
  }
  handleUpdateEnterDeposit(orderId: any, deposit: any) {
    this.isLoading = true;
    this.orderService.updateDeposit(orderId, deposit).pipe(
      finalize(() => {
        this.getOrdersAndTotalMoney(this.schedule?.id)
      })
    ).subscribe(
      data => {
        if (data.success) {
          this.message.success("Cập nhập tiền cọc", "Thành công", { timeOut: 2000, progressBar: true })
        }
      }
    )
  }
  handleCancelBooking(orderId: any) {
    this.isLoading = true;
    this.orderService.cancelTicket(orderId).pipe(
      finalize(() => {
        this.message.success("Hủy đơn đặt vé", "Thành công", { timeOut: 2000, progressBar: true })
        this.getOrdersAndTotalMoney(this.schedule?.id)
      })
    ).subscribe()
  }
  handleConfirmPaid(orderId: any) {
    this.isLoading = true;
    this.orderService.confirmPaid(orderId).pipe(
      finalize(() => {
        this.getOrdersAndTotalMoney(this.schedule?.id)
        this.message.success("Xác nhận thanh toán", "Thành công", { timeOut: 2000, progressBar: true })
      })
    ).subscribe()
  }

}
