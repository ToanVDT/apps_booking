import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetailMoney, DetailInfoCustomer } from '../../model/order.model';

@Component({
  selector: 'app-dialog-detail',
  templateUrl: './dialog-detail.component.html',
  styleUrls: ['./dialog-detail.component.scss']
})
export class DialogDetailComponent implements OnInit {

  detailMoney: DetailMoney = {};
  detailInfoCustomer: DetailInfoCustomer = {};
  
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
  
  ngOnInit(): void {
    
    this.detailInfoCustomer = this.data.detailInfoCustomer;
    this.detailMoney = this.data.detailMoney;
  }
  

}
