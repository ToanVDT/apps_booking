import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

import { ToastrService } from 'ngx-toastr';
import { forkJoin, finalize } from 'rxjs';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { Shuttle } from '../model/shuttle.model';
import { RouteService } from '../service/route.service';
import { DialogScheduleComponent } from './dialog-schedule/dialog-schedule.component';
import { Schedule } from '../model/schedule.model';
import { ScheduleService } from '../service/schedule.service';
import { FormControl, FormGroup } from '@angular/forms';
import { Routes } from '../model/route.model';
import { DialogUpdateScheduleComponent } from './dialog-update-schedule/dialog-update-schedule.component';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {

  displayedColumns: string[] = [
    'busName',
    'price',
    'dateTime',
    'action'
  ];
  routes:Routes[]=[];
  route: Routes = {};
  shuttle : Shuttle = {}
  user:any;
  isLoading : boolean = false;
  noData:boolean = true;
  schedules:Schedule[]=[];
  schedule:Schedule={}
  scheduleForm:FormGroup

  dataSource = new MatTableDataSource(this.schedules);
  dataSourceWithPageSize = new MatTableDataSource(this.schedules);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private routeService:RouteService,private scheduleService:ScheduleService,
    private message:ToastrService) {
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
    this.getRoutes()
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
        routeId:this.route?.id
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
        // console.log("data",data)
      }
    )
  }
  openFormUpdateSchedule(schedule:any){
    const dialogRef =this.dialog.open(DialogUpdateScheduleComponent,{
      data:{
        schedule:schedule,
        routes:this.routes,
        routeId:this.route?.id
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }

  getSchedule(routeId:any){
    let response:any;
    this.scheduleService.getAllSchedule(routeId).pipe(
      finalize(()=>{
        if(response[0]?.id){
          this.noData = false;
          this.dataSource = new MatTableDataSource(this.schedules)
          this.dataSource.paginator = this.paginator;
        }
        else{
          this.noData = true;
        }
        this.isLoading = false;
      })
    ).subscribe(
      data=>{
        this.schedules = data.data
        response = this.schedules
      }
    )
  }
  getRoutes(){
  this.isLoading = true
   this.routeService.getAllRoutes(this.user.data.id).pipe(
    finalize(()=>{
      this.getSchedule(this.routes[0]?.id);
    })
  ).subscribe(
    data=>{
    
      this.routes = data.data;
      this.scheduleForm.get("route")?.setValue(this.routes[0])
    }
  )
  }
  handleCreateOrUpdate(schedule:any){
    this.isLoading = true;
    if(schedule?.id){
      this.scheduleService.updateSchedule(schedule).pipe(
        finalize(()=>{
          this.getRoutes()
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
          this.getRoutes()
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
}
