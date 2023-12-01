import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Orders } from '../../model/order.model';

@Component({
  selector: 'app-dialog-deposit-order',
  templateUrl: './dialog-deposit-order.component.html',
  styleUrls: ['./dialog-deposit-order.component.scss']
})
export class DialogDepositOrderComponent implements OnInit {

  @Output() updateDeposit = new EventEmitter<any>();
  depositForm:FormGroup;
  order:Orders = {}
  totalPrice:any;
  orderId:any;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { 
    this.depositForm = new FormGroup({
      deposit: new FormControl('', [
        Validators.max(this.totalPrice), Validators.required])
    })
  }

  ngOnInit(): void {
    this.order = this.data.order
    this.totalPrice = this.order?.totalPrice
    this.orderId = this.order?.id;
  }

  onSubmit(){
    if(this.depositForm.valid){
      this.updateDeposit.emit({
        orderId:this.orderId,
        deposit:this.depositForm.value?.deposit
      })
    }
  }

}
