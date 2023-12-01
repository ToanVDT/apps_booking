import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { AuthenticationService } from '../../../auth/service/authentication.service';
import { CustomerService } from '../../service/customer.service';
import { GiftCode } from '../../../brand-owner/model/promotion.model';

@Component({
  selector: 'app-promotion',
  templateUrl: './promotion.component.html',
  styleUrls: ['./promotion.component.scss']
})
export class PromotionComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns: string[] = [
    'code',
    'promotion',
    'expireDate',
    'isUsed',
  ];
  user:any;
  isUsed:any;
  noData:boolean = true;
  giftCode:GiftCode ={}
  giftCodes:GiftCode []=[]
  isLoading : boolean = false;

  dataSource = new MatTableDataSource(this.giftCodes);
  dataSourceWithPageSize = new MatTableDataSource(this.giftCodes);

  constructor( private auth:AuthenticationService,
    private customerService:CustomerService) {
    
    }
  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getGiftCode(this.user?.data?.id)
  }
 getGiftCode(userId:any){
  this.isLoading = true;
  let response:any;
  this.customerService.getGiftCode(userId).pipe(
    finalize(()=>{
      if(response[0]?.giftCode){
        this.noData = false;
        this.dataSource = new MatTableDataSource(this.giftCodes)
        this.dataSource.paginator = this.paginator;
      }
      else{
        this.noData = true;
      }
      this.isLoading = false
    })
  ).subscribe(
    data=>{
      this.giftCodes = data.data
      response = data.data
      this.giftCodes.map((item)=>{
        if(item.isUsed){
          item.isUsedString = 'Đã sử dụng'
        }
        else{
          item.isUsedString = 'Chưa sử dụng'
        }
      })
    }
  )
  }

}
