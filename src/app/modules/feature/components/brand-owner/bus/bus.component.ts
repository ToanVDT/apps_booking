import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../service/route.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { BusDialogComponent } from './bus-dialog/bus-dialog.component';
import { debounceTime, distinctUntilChanged, finalize, forkJoin, pipe } from 'rxjs';
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
  typeBus = ["Phòng","Ghế ngồi", "Giường nằm"]
  noData:boolean = true;
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

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getTypeAndBus()
  }
  openFormAddRoute(bus:any){
    const dialogRef =this.dialog.open(BusDialogComponent,{
      data:{
        bus:bus,
        type:this.type
      },width:'500px'
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }
  getTypeAndBus(){
    let response:any;
    this.isLoading = true;
    forkJoin({
      types:this.getType(),
      buses:this.getBuses()
    }).pipe(
      finalize(()=>{
        if(response[0]?.id){
          this.noData = false;
          this.dataSource = new MatTableDataSource(this.buses); 
          this.dataSource.paginator = this.paginator;
        }
        else{
          this.noData = true;
        }
        this.isLoading = false; 
      })
    ).subscribe(
      data=>{
        this.buses = data.buses.data
        this.type = data.types.data
        response = data.buses.data
      }
    )
  }
  getType(){
  return  this.busService.getType().pipe()
  }
  getBuses(){
   return this.busService.getAllBuses(this.user.data.id).pipe()
  }
  handleCreateOrUpdate(bus:any){
    console.log("databus", bus)
    let value: any;
    const request = {...bus, userId:this.user.data.id}
    this.isLoading = true;
    this.busService.createOrUpdate(request).pipe(
      finalize(()=>{
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(value);
        this.dataSource.paginator = this.paginator;
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
    let busName ='Bạn chắc chắn xóa xe: '+
      this.bus?.name + ' - biển số: ' + this.bus.identityCode;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: busName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.handleDeleteBus(bus?.id);
    });
  }
  handleDeleteBus(busId:any){
    this.isLoading = true;
    this.busService.deleteBus(busId).pipe(
      finalize(()=>{
        this.getTypeAndBus()
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Xóa xe","Thành công",{timeOut:2000, progressBar:true})
        }
        else{
          this.message.error("Xe đang có lịch trình","Thất bại",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
}
