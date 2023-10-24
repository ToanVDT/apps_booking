import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Routes } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { forkJoin, finalize } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { Shuttle } from '../model/shuttle.model';
import { RouteService } from '../service/route.service';
import { ShuttleService } from '../service/shuttle.service';
import { DialogEditShuttleComponent } from '../shuttle/dialog-edit-shuttle/dialog-edit-shuttle.component';
import { DialogShuttleComponent } from '../shuttle/dialog-shuttle/dialog-shuttle.component';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';
import { BusService } from '../service/bus.service';
import { Bus } from '../model/bus.model';
import { Schedule } from '../model/schedule.model';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  displayedColumns: string[] = [
    'startTime',
    'endTime',
    'routeName',
    'action'
  ];
  routes:Routes[]=[];
  buses : Bus[] = [];
  shuttle : Shuttle = {}
  user:any;
  isLoading : boolean = false;
  schedules:Schedule[]=[];
  schedule:Schedule={}

  dataSource = new MatTableDataSource(this.schedules);
  dataSourceWithPageSize = new MatTableDataSource(this.schedules);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private routeService:RouteService,private busService:BusService,
    private shuttleService:ShuttleService, private message:ToastrService) {}

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
  }
  openFormSchedule(schedule:any){
    const dialogRef =this.dialog.open(DialogScheduleComponent,{
      data:{
        schedule:schedule,
        routes:this.routes,
        bus:this.buses
      }
    })
    // dialogRef.componentInstance.createOrUpdate.subscribe(
    //   data=>{
    //     this.handleCreateOrUpdate(data)
    //   }
    // )
  }

  getBusAndRoute(){
    this.isLoading = true
    forkJoin({
      routes:this.getRoutes(),
      bus:this.getBus()
    }).pipe(
      finalize(()=>{
       
        this.isLoading = false;
      })
    ).subscribe(
      data=>{
        this.routes = data.routes.data;
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
  handleCreateOrUpdate(shuttle:any){
    this.isLoading = true;
    if(shuttle?.id){
      this.shuttleService.updateShuttle(shuttle).pipe(
        finalize(()=>{
          this.getBusAndRoute()
        })
      ).subscribe(
        data=>{
        
          if(data.success){
            this.message.success("Chỉnh sửa khung giờ chạy","Thành công",{timeOut:2000, progressBar:true})
          }
        }
      )
    }
    else{
      this.shuttleService.createShuttle(shuttle).pipe(
        finalize(()=>{
          this.getBusAndRoute()
        })
      ).subscribe(
        data=>{
      
          if(data.success){
            this.message.success("Thêm khung giờ chạy","Thành công",{timeOut:2000,progressBar:true})
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
