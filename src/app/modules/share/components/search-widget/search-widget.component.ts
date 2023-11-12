import { Component, EventEmitter, OnInit,Output } from '@angular/core';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Provinces } from 'src/assets/data/provinces';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {
  @Output() dataSearch = new EventEmitter<any>()
  diemDiOptions: string []=[]
  diemDenOptions:string []=[]
  isLoadingPage:boolean = false;
  today = new Date();
  diemDi: string = '';
  diemDen: string = '';
  ngayDi!: Date;
  request:{startPoint?:string, endPoint?:string, travelDate?:any} = {}
  constructor(private router:Router) { }

  ngOnInit(): void {
    this.diemDenOptions = Provinces
    this.diemDiOptions = Provinces
  }
  daoNguocDiem() {
      const temp = this.diemDi;
      this.diemDi = this.diemDen;
      this.diemDen = temp;
  }
  searchShuttleAvailable(){
    this.isLoadingPage = true;
    this.request = {startPoint:this.diemDi, endPoint:this.diemDen, travelDate:this.ngayDi};
    this.dataSearch.emit(this.request)
    this.router.navigateByUrl("/customer/list-result-shuttle",{state:this.request})
  }
}
