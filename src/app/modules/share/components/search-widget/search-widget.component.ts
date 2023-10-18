import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-search-widget',
  templateUrl: './search-widget.component.html',
  styleUrls: ['./search-widget.component.scss']
})
export class SearchWidgetComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  diemDi: string = '';
  diemDen: string = '';
  ngayDi!: Date;

  diemDiOptions: string[] = [
      'Sài Gòn',
      'Đồng Nai',
      'Bình Thuận',
      'Khánh Hoà',
      'Ninh Thuận',
      'Phú Yên',
      'Bình Định',
      'Quảng Ngãi',
  ];
  diemDenOptions: string[] = [
      'Sài Gòn',
      'Đồng Nai',
      'Bình Thuận',
      'Khánh Hoà',
      'Ninh Thuận',
      'Phú Yên',
      'Bình Định',
      'Quảng Ngãi',
  ];

  muaVe() {
      console.log('Điểm Đi:', this.diemDi);
      console.log('Điểm Đến:', this.diemDen);
      console.log('Ngày Đi:', this.ngayDi);
  }

  daoNguocDiem() {
      const temp = this.diemDi;
      this.diemDi = this.diemDen;
      this.diemDen = temp;
  }
}
