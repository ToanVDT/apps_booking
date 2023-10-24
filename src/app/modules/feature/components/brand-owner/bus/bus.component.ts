import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../service/route.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { BusDialogComponent } from './bus-dialog/bus-dialog.component';
import { finalize, forkJoin, pipe } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';
import { Bus } from '../model/bus.model';
import { BusService } from '../service/bus.service';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  displayedColumns: string[] = [
    'name',
    'identityCode',
    'seats',
    'busType',
    'description',
    'action'
  ];

  buses : Bus[] = [];
  bus : Bus = {}
  user:any;
  isLoading : boolean = false;
  type:any;

  dataSource = new MatTableDataSource(this.buses);
  dataSourceWithPageSize = new MatTableDataSource(this.buses);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private busService:BusService, private message:ToastrService) {}

  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild('paginatorPageSize') paginatorPageSize!: MatPaginator;

  pageSizes = [3, 5, 7];

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getTypeAnfRoute()
  }
  openFormAddRoute(bus:any){
    const dialogRef =this.dialog.open(BusDialogComponent,{
      data:{
        bus:bus,
        type:this.type
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }
  getTypeAnfRoute(){
    this.isLoading = true;
    forkJoin({
      types:this.getType(),
      routes:this.getRoutes()
    }).pipe(
      finalize(()=>{
        this.dataSource = new MatTableDataSource(this.buses); 
        this.isLoading = false; 
      })
    ).subscribe(
      data=>{
        this.buses = data.routes.data
        this.type = data.types.data
        console.log("buses", this.buses)
      }
    )
  }
  getType(){
  return  this.busService.getType().pipe()
  }
  getRoutes(){
   return this.busService.getAllBuses(this.user.data.id).pipe()
  }
  handleCreateOrUpdate(bus:any){
    let value: any;
    const request = {...bus, userId:this.user.data.id}
    this.isLoading = true;
    this.busService.createOrUpdate(request).pipe(
      finalize(()=>{
        this.isLoading = false;
        console.log("value", value)
        this.dataSource = new MatTableDataSource(value);
      })
    ).subscribe(
      data=>{
        value = data.data;
        if(data.success && data.message == "Thêm"){
          this.message.success("Thêm xe","Thành công",{timeOut:2000,progressBar:true})
        }
        if(data.success && data.message == "Chỉnh sửa"){
          this.message.success("Chỉnh sửa xe","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
  deleteBus(bus: any) {
    this.bus = { ...bus };
    let busName ='Bạn chắc chắn xóa xe:'+
      this.bus?.name + ' - biển số: ' + this.bus.identityCode;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { bus: busName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      // this.confirmDelete();
    });
  }

}
