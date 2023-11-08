import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OrderDTO } from 'src/app/modules/feature/components/brand-owner/model/order.model';

@Component({
  selector: 'app-show-detail-order-customer',
  templateUrl: './show-detail-order-customer.component.html',
  styleUrls: ['./show-detail-order-customer.component.scss']
})
export class ShowDetailOrderCustomerComponent implements OnInit {

  orderDTO: OrderDTO = {}
  orderStatus: any
  isLoading: boolean = false;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
  ngOnInit(): void {
    console.log("data", this.data)
    this.orderDTO = this.data.detailCurrentOrder
    if (this.orderDTO.orderStatus === 'ORDERED') {
      this.orderStatus = 'Đã đặt'
    }
    else if (this.orderDTO.orderStatus === 'CANCELED') {
      this.orderStatus = 'Đã hủy'
    }
    else if((this.orderDTO.orderStatus === 'PENDING')) {
      this.orderStatus = 'Chờ duyệt'
    }
    else{
      this.orderStatus = 'Hoàn thành'
    }
  }

}
