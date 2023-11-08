import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrderService } from '../../../brand-owner/service/order.service';
import { ToastrService } from 'ngx-toastr';
import { OrderDTO } from '../../../brand-owner/model/order.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-dialog-show-order',
  templateUrl: './dialog-show-order.component.html',
  styleUrls: ['./dialog-show-order.component.scss']
})
export class DialogShowOrderComponent implements OnInit {

 
orderSearchForm:FormGroup;
orderCodeValid:boolean = false
orerCode:any;
orderDTO:OrderDTO = {}
orderStatus:any
isLoading:boolean = false;
constructor(private orderService:OrderService, private message:ToastrService) { 
  this.orderSearchForm = new FormGroup({
    orderCode: new FormControl('',[Validators.required])
  })
}

ngOnInit(): void {
  this.orderSearchForm.get('orderCode')?.valueChanges.subscribe(
    value=>{
      if(value){
        this.orerCode = value
      }
    }
  )
}
openShowOrder(){
  this.isLoading = true
  this.orderService.getOrderByOrderCode(this.orerCode).pipe(
    finalize(()=>{
      this.isLoading = false;
    })
  ).subscribe(
    data=>{
      if(data.success){
        this.orderCodeValid = true;
        this.orderDTO = data.data
        if(this.orderDTO.orderStatus === 'ORDERED'){
          this.orderStatus = 'Đã đặt'
        }
        else if(this.orderDTO.orderStatus === 'CANCELED'){
          this.orderStatus = 'Đã hủy'
        }
        else if(this.orderDTO.orderStatus === 'PENDING'){
          this.orderStatus = 'Chờ duyệt'
        }
        else{
          this.orderStatus = 'Hoàn thành'
        }

      }
      else{
        this.orderCodeValid = false;
        this.orderSearchForm.get('orderCode')?.setValue(null)
        this.message.error("Mã đơn đặt không tồn tại","Thất bại",{timeOut:2000, progressBar:true})
      }
    }
  )
}

}
