import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../brand-owner/service/order.service';
import { ToastrService } from 'ngx-toastr';
import { DateAndTime, OrderDTO } from '../../../brand-owner/model/order.model';
import { finalize } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-dialog-show-order',
  templateUrl: './dialog-show-order.component.html',
  styleUrls: ['./dialog-show-order.component.scss']
})
export class DialogShowOrderComponent implements OnInit {

  today = new Date();
  timeValidToCancelBooking: boolean = true;
  orderSearchForm: FormGroup;
  clickCancelTicket: boolean = false;
  orderCodeValid: boolean = false
  orerCode: any;
  orderDTO: OrderDTO = {}
  dateTime: DateAndTime = {}
  orderStatus: any
  isLoading: boolean = false;
  constructor(private orderService: OrderService, private message: ToastrService) {
    this.orderSearchForm = new FormGroup({
      orderCode: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.orderSearchForm.get('orderCode')?.valueChanges.subscribe(
      value => {
        if (value) {
          this.orerCode = value
        }
      }
    )
  }
  getDateAndTime(orderId: any) {
    this.orderService.getDateAndTimeByOrder(orderId).pipe(
      finalize(() => {
        let dateCancelBooking = moment(this.today).format('yyyy-MM-DD');
        let timeCancelBooking = moment(this.today).add(2, 'hours').format('HH:mm')
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
      })
    ).subscribe(
      data => {
        this.dateTime = data.data
      }
    )
  }
  openShowOrder() {
    this.isLoading = true
    this.orderService.getOrderByOrderCode(this.orerCode).pipe(
      finalize(() => {
        this.isLoading = false;
        this.getDateAndTime(this.orderDTO?.orderId)
      })
    ).subscribe(
      data => {
        if (data.success) {
          this.orderCodeValid = true;
          this.orderDTO = data.data
          if (this.orderDTO.orderStatus === 'ORDERED') {
            this.orderStatus = 'Đã đặt'
          }
          else if (this.orderDTO.orderStatus === 'CANCELED') {
            this.orderStatus = 'Đã hủy'
          }
          else if (this.orderDTO.orderStatus === 'PENDING') {
            this.orderStatus = 'Chờ duyệt'
          }
          else {
            this.orderStatus = 'Hoàn thành'
          }

        }
        else {
          this.orderCodeValid = false;
          this.orderSearchForm.get('orderCode')?.setValue(null)
          this.message.error("Mã đơn đặt không tồn tại", "Thất bại", { timeOut: 2000, progressBar: true })
        }
      }
    )
  }
  cancelTicket() {
    this.clickCancelTicket = true
  }
  handleCancelBooking() {
    this.isLoading = true;
    this.orderService.cancelTicket(this.orderDTO?.orderId).pipe(
      finalize(() => {
        this.message.success("Hủy đơn đặt vé", "Thành công", { timeOut: 2000, progressBar: true })
        this.isLoading = false
      })
    ).subscribe()
  }

}
