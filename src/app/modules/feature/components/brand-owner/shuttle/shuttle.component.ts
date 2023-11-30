import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { finalize, forkJoin } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';
import { BusDialogComponent } from '../bus/bus-dialog/bus-dialog.component';
import { MatPaginator } from '@angular/material/paginator';
import { BusService } from '../service/bus.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { Bus } from '../model/bus.model';
import { DialogShuttleComponent } from './dialog-shuttle/dialog-shuttle.component';
import { routes } from '../../common/routes';
import { RouteService } from '../service/route.service';
import { ShuttleService } from '../service/shuttle.service';
import { Routes } from '../model/route.model';
import { Shuttle } from '../model/shuttle.model';
import { DialogEditShuttleComponent } from './dialog-edit-shuttle/dialog-edit-shuttle.component';

@Component({
  selector: 'app-shuttle',
  templateUrl: './shuttle.component.html',
  styleUrls: ['./shuttle.component.scss']
})
export class ShuttleComponent implements OnInit {

  displayedColumns: string[] = [
    'startTime',
    'endTime',
    'routeName',
    'action'
  ];
  noData:boolean = true;
  routes:Routes[]=[];
  shuttles : Shuttle[] = [];
  shuttle : Shuttle = {}
  user:any;
  isLoading : boolean = false;

  dataSource = new MatTableDataSource(this.shuttles);
  dataSourceWithPageSize = new MatTableDataSource(this.shuttles);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private routeService:RouteService,
    private shuttleService:ShuttleService, private message:ToastrService) {}

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize!: MatPaginator;

  pageSizes = [3, 5, 7];

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getShuttleAndRoute()
  }
  openFormAddRoute(shuttle:any){
    const dialogRef =this.dialog.open(DialogShuttleComponent,{
      data:{
        shuttle:shuttle,
        routes:this.routes
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }
  openFormUpdateShuttle(shuttle:any){
    const dialogRef = this.dialog.open(DialogEditShuttleComponent,{
      data:{
        shuttle:shuttle,
        routes:this.routes
      }
    })
    dialogRef.componentInstance.Update.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }
  getShuttleAndRoute(){
    this.isLoading = true
    let response:any
    forkJoin({
      routes:this.getRoutes(),
      shuttles:this.getShuttle()
    }).pipe(
      finalize(()=>{
        if(response[0]?.id){
          this.noData = false
          this.dataSource = new MatTableDataSource(this.shuttles)
          this.dataSource.paginator = this.paginator;
        }
        else{
          this.noData = true
        }
        this.isLoading = false;
      })
    ).subscribe(
      data=>{
        this.routes = data.routes.data;
        this.shuttles = data.shuttles.data;
        response = data.shuttles.data
      }
    )
  }
  getShuttle(){
   return this.shuttleService.getAllShuttles(this.user.data?.id).pipe()
  }
  getRoutes(){
   return this.routeService.getAllRoutes(this.user.data.id).pipe()
  }
  handleCreateOrUpdate(shuttle:any){
    this.isLoading = true;
    if(shuttle?.id){
      this.shuttleService.updateShuttle(shuttle).pipe(
        finalize(()=>{
          this.getShuttleAndRoute()
        })
      ).subscribe(
        data=>{
          if(data.success){
            this.message.success("Chỉnh sửa khung giờ chạy","Thành công",{timeOut:2000, progressBar:true})
          }
          else {
            this.message.error("Dữ liệu trùng","Thất bại",{timeOut:2000,progressBar:true})
          }
        }
      )
    }
    else{
      this.shuttleService.createShuttle(shuttle).pipe(
        finalize(()=>{
          this.getShuttleAndRoute()
        })
      ).subscribe(
        data=>{
          if(data.success){
            this.message.success("Thêm khung giờ chạy","Thành công",{timeOut:2000,progressBar:true})
          }
          else {
            this.message.error("Dữ liệu trùng","Thất bại",{timeOut:2000,progressBar:true})
          }
        }
      )
    }
  }
  deleteShuttle(shuttle: any) {
    this.shuttle = { ...shuttle };
    let shuttleName ='Bạn chắc chắn xóa khung giờ:'+
      this.shuttle?.startTime + ' - trong tuyến: ' + this.shuttle.routeName;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: shuttleName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.handleDeleteShuttle(shuttle?.id)
    });
  }
  handleDeleteShuttle(shuttleId:any){
    this.isLoading = true;
  this.shuttleService.deleteShuttle(shuttleId).pipe(
    finalize(()=>{
      this.getShuttleAndRoute()
    })
  ).subscribe(
    data=>{
      if(data.success){
        this.message.success("Xóa khung giờ chạy","Thành công",{timeOut:2000, progressBar:true})
      }
      else{
        this.message.error("Xóa khung giờ chạy","Thất bại",{timeOut:2000, progressBar:true})
      }
    }
  )
  }
}
