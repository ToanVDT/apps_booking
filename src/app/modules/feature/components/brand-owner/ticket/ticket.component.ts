import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { forkJoin, finalize } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { Bus } from '../model/bus.model';
import { Shuttle } from '../model/shuttle.model';
import { RouteService } from '../service/route.service';
import { ScheduleService } from '../service/schedule.service';
import { ShuttleService } from '../service/shuttle.service';
import { TicketService } from '../service/ticket.service';
import { Routes } from '../model/route.model';
import { Ticket } from '../model/ticket.model';
import { ScheduleDTO } from '../model/schedule.model';
import * as moment from 'moment';
import { BookingComponent } from './booking/booking.component';

@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss']
})
export class TicketComponent implements OnInit {

  @ViewChild('paginator') paginator!: MatPaginator;

  displayedColumns: string[] = [
    'seatName',
    'price',
    'statusTicket',
    'inforCustomer',
    'action'
  ];
  today = new Date();
  status = ["Đã đặt", "Chưa đặt", "Chờ duyệt"]
  routes:Routes[]=[];
  route: Routes = {};
  buses : Bus[] = [];
  isBooked:boolean = true;
  shuttle : Shuttle = {}
  customerInfo:boolean = true;
  user:any;
  noData:boolean = true;
  tickets:Ticket[]=[]
  ticket:Ticket ={}
  emptyTicket:any;
  dateStart:any;
  isLoading : boolean = false;
  schedules:ScheduleDTO[]=[];
  schedule:ScheduleDTO ={}
  ticketForm:FormGroup

  dataSource = new MatTableDataSource(this.tickets);
  dataSourceWithPageSize = new MatTableDataSource(this.tickets);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private routeService:RouteService,private ticketService:TicketService,private scheduleService:ScheduleService,
    private shuttleService:ShuttleService, private message:ToastrService) {
      this.ticketForm = new FormGroup({
        schedule:new FormControl(""),
        dateStart:new FormControl("")
      })
    }
  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.ticketForm.get("dateStart")?.valueChanges.subscribe((value) => {
      this.getScheduleByTravelDate(value)
      this.dateStart = value;
    });
    this.ticketForm.get("schedule")?.valueChanges.subscribe(
      (value)=>{
        this.schedule = value;
        this.getEmptySeatAndSeatInTicketPage(this.dateStart,this.schedule?.id)
      }
    )
    let todayFormat = moment(this.today).format('yyyy-MM-DD');
    this.ticketForm.get("dateStart")?.setValue(todayFormat)
  }
  getEmptySeatAndSeatInTicketPage(dateStart:any,scheduleId:any){
    forkJoin({
      emptySeat:this.getEmptySeat(dateStart,scheduleId),
      tickets:this.getSeatInTicketPage(scheduleId)
    }).pipe(
      finalize(()=>{
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(this.tickets)
        this.dataSource.paginator = this.paginator;
      })
    ).subscribe(
      data=>{
        this.tickets = data.tickets.data
        this.emptyTicket = data.emptySeat
        this.tickets.map((item)=>{
          if(item.statusTicket === "ORDERED"){
            item.statusTicket = this.status[0]
            item.booked = true;
          }
          else if(item.statusTicket === "INITIALIZED"){
            item.statusTicket = this.status[1]
            item.booked = false;
          }
          else{
            item.statusTicket = this.status[2]
            item.booked = true;
          }
        })
        
      }
    )
  }
  getEmptySeat(dateStart:any,scheduleId:any){
    return this.ticketService.getEmptySeat(dateStart,scheduleId).pipe()
  }

  getSeatInTicketPage(scheduleId:any){
    return this.ticketService.getSeatInTicketPage(scheduleId).pipe()
  }
  getScheduleByTravelDate(dateStart:any){
    let value:any;
    this.isLoading = true;
    this.scheduleService.getScheduleByTravelDate(dateStart).pipe(
      finalize(()=>{
        if(value[0]?.id){
          this.noData = false;
          this.ticketForm.get("schedule")?.setValue(this.schedules[0])
        }
        else{
          this.noData = true;
          this.isLoading = false;
        }
        // this.dataSource  =new MatTableDataSource(this.schedules)
      })
    ).subscribe(
      data=>{
        this.schedules = data
        value = data;
      }
    )
  }
  openBookingTicket(ticket:any){
    const dialogRef = this.dialog.open(BookingComponent,{
      data:{
        ticket:ticket
      },
    width:'700px'
    })
  }

}
