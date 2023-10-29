import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { Bus } from '../model/bus.model';
import { Schedule } from '../model/schedule.model';
import { Shuttle } from '../model/shuttle.model';
import { DialogScheduleComponent } from '../schedule/dialog-schedule/dialog-schedule.component';
import { BusService } from '../service/bus.service';
import { RouteService } from '../service/route.service';
import { ScheduleService } from '../service/schedule.service';
import { ShuttleService } from '../service/shuttle.service';
import { Routes } from '../model/route.model';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {

  displayedColumns: string[] = [
    'busName',
    'price',
    'dateTime',
    'action'
  ];
  routes:Routes[]=[];
  route: Routes = {};
  buses : Bus[] = [];
  shuttle : Shuttle = {}
  user:any;
  isLoading : boolean = false;
  schedules:Schedule[]=[];
  schedule:Schedule={}
  scheduleForm:FormGroup

  dataSource = new MatTableDataSource(this.schedules);
  dataSourceWithPageSize = new MatTableDataSource(this.schedules);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private routeService:RouteService,private busService:BusService,private scheduleService:ScheduleService,
    private shuttleService:ShuttleService, private message:ToastrService) {
      this.scheduleForm = new FormGroup({
        route:new FormControl("")
      })
    }

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize!: MatPaginator;

  pageSizes = [3, 5, 7];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getBusAndRoute()
    this.scheduleForm.get("route")?.valueChanges.subscribe((value) => {
      if (value) {
        this.route = value;
        this.isLoading = true;
        this.getSchedule(value?.id);
      }
    });
  }
  openFormSchedule(schedule:any){
    const dialogRef =this.dialog.open(DialogScheduleComponent,{
      data:{
        schedule:schedule,
        routes:this.routes,
        bus:this.buses,
        routeId:this.route?.id
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        // console.log("datarecieves", data)
        this.handleCreateOrUpdate(data)
      }
    )
  }

  getSchedule(routeId:any){
    this.scheduleService.getAllSchedule(routeId).pipe(
      finalize(()=>{
        this.isLoading = false;
        this.dataSource  =new MatTableDataSource(this.schedules)
      })
    ).subscribe(
      data=>{
        this.schedules = data.data
        // console.log("data", this.schedules)
      }
    )
  }
  getBusAndRoute(){
    this.isLoading = true
    forkJoin({
      routes:this.getRoutes(),
      bus:this.getBus()
    }).pipe(
      finalize(()=>{
  
      })
    ).subscribe(
      data=>{
        this.routes = data.routes.data;
        this.scheduleForm.get("route")?.setValue(this.routes[0])
        this.buses = data.bus;
      }
    )
  }
  getBus(){
   return this.busService.getBusForDropDown(this.user.data.id).pipe()
  }
  getRoutes(){
   return this.routeService.getAllRoutes(this.user.data.id).pipe()
  }
  handleCreateOrUpdate(schedule:any){
    this.isLoading = true;
    if(schedule?.id){
      this.scheduleService.updateSchedule(schedule).pipe(
        finalize(()=>{
          this.getBusAndRoute()
        })
      ).subscribe(
        data=>{ 
          if(data.success){
            this.message.success("Chỉnh sửa lịch trình","Thành công",{timeOut:2000, progressBar:true})
          }
        }
      )
    }
    else{
      this.scheduleService.createSchedule(schedule).pipe(
        finalize(()=>{
          this.getBusAndRoute()
        })
      ).subscribe(
        data=>{
          if(data.success){
            this.message.success("Thêm lịch trình","Thành công",{timeOut:2000,progressBar:true})
          }
        }
      )
    }
  }
  deleteSchedule(shuttle: any) {
    this.shuttle = { ...shuttle };
    let shuttleName ='Bạn chắc chắn xóa khung giờ:'+
      this.shuttle?.startTime + ' - trong tuyến: ' + this.shuttle.routeName;
    let dialogRef = this.dialog.open( ConfirmDialogComponent, {
      data: { name: shuttleName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      // this.confirmDelete();
    });
  }

}
