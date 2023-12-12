import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Routes } from '../model/route.model';
import { Shuttle } from '../model/shuttle.model';
import { Orders, Report } from '../model/order.model';
import { ScheduleDTO } from '../model/schedule.model';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { forkJoin, finalize } from 'rxjs';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { OrderService } from '../service/order.service';
import html2canvas from 'html2canvas';
import { ScheduleService } from '../service/schedule.service';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class ReportComponent implements OnInit {
  // @ViewChild('pdfTable', {static: false}) pdfTable: ElementRef ;
  @ViewChild('htmlData') htmlData!: ElementRef;

  today = new Date();
  routes: Routes[] = [];
  route: Routes = {};
  shuttle: Shuttle = {}
  user: any;
  totalMoney: number = 0;
  reports: Report[] = [];
  day: any;
  month: any;
  year: any;
  report: Report = {}
  noData: boolean = true;
  isLoading: boolean = false;
  isApproval: boolean = true;
  schedules: ScheduleDTO[] = [];
  schedule: ScheduleDTO = {}
  orderForm: FormGroup

  constructor(private auth: AuthenticationService,
    private scheduleService: ScheduleService, private orderService: OrderService) {
    this.orderForm = new FormGroup({
      schedule: new FormControl(""),
      dateStart: new FormControl("")
    })
  }
  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.day = moment(this.today).format('D')
    this.month = moment(this.today).format('M');
    this.year = moment(this.today).format('YYYY');
    this.orderForm.get("dateStart")?.valueChanges.subscribe((value) => {
      this.getScheduleByTravelDate(value)
    });
    this.orderForm.get("schedule")?.valueChanges.subscribe(
      (value) => {
        this.schedule = value;
        this.getReportsAndTotalMoney(this.schedule?.id)
      }
    )
    let todayFormat = moment(this.today).format('yyyy-MM-DD');
    this.orderForm.get("dateStart")?.setValue(todayFormat)
  }
  getReportsAndTotalMoney(scheduleId: any) {
    let response: any;
    forkJoin({
      reports: this.getReport(scheduleId),
      money: this.getMoney(scheduleId)
    }).pipe(
      finalize(() => {
        if (response[0]?.orderCode) {
          this.noData = false;
          this.isLoading = false
        }
        else {
          this.noData = true;
          this.isLoading = false
        }
      })
    ).subscribe(
      data => {
        response = data.reports.data;
        this.reports = data.reports.data;
        this.totalMoney = data.money.data
      }
    )
  }
  getMoney(scheduleId: any) {
    return this.orderService.getTotalMoneyOrder(scheduleId).pipe()
  }
  getReport(scheduleId: any) {
    return this.orderService.getReport(scheduleId).pipe()
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
  openPDF() {
    let DATA: any = document.getElementById('htmlData');
    html2canvas(DATA).then((canvas) => {
      let fileWidth = 208;
      let fileHeight = (canvas.height * fileWidth) / canvas.width;
      const FILEURI = canvas.toDataURL('image/png');
      let PDF = new jsPDF('p', 'mm', 'a4');
      let position = 0;
      PDF.addImage(FILEURI, 'PNG', 0, position, fileWidth, fileHeight);
      PDF.save('report.pdf');
    });
  }
}
