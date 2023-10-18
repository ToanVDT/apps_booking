import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { MatDialog } from '@angular/material/dialog';
import { RouteService } from '../service/route.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { BusDialogComponent } from './bus-dialog/bus-dialog.component';
import { finalize } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';
import { Bus } from '../model/bus.model';

@Component({
  selector: 'app-bus',
  templateUrl: './bus.component.html',
  styleUrls: ['./bus.component.scss']
})
export class BusComponent implements OnInit {

  displayedColumns: string[] = [
    'startPoint',
    'endPoint',
    'action'
  ];

  routes : Bus[] = [];
  route : Bus = {}
  user:any;
  isLoading : boolean = false;

  dataSource = new MatTableDataSource(this.routes);
  dataSourceWithPageSize = new MatTableDataSource(this.routes);

  constructor(private dialog:MatDialog, private auth:AuthenticationService,
    private routeService:RouteService, private message:ToastrService) {}

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
  }
  openFormAddRoute(bus:any){
    const dialogRef =this.dialog.open(BusDialogComponent,{
      data:{
        bus:bus
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }
  getRoutes(){
    this.isLoading = true;
    this.routeService.getAllRoutes(this.user.data.id).pipe(
      finalize(()=>{
        this.dataSource = new MatTableDataSource(this.routes); 
        this.isLoading = false;     
      })
    ).subscribe(
      data=>{
        this.routes = data.data
      }
    )
  }
  handleCreateOrUpdate(route:any){
    let value: any;
    const request = {...route, userId:this.user.data.id}
    this.isLoading = true;
    this.routeService.createOrUpdate(request).pipe(
      finalize(()=>{
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(value);
      })
    ).subscribe(
      data=>{
        value = data.data;
        if(data.success && data.message == "Thêm"){
          this.message.success("Thêm tuyến xe","Thành công",{timeOut:2000,progressBar:true})
        }
        if(data.success && data.message == "Chỉnh sửa"){
          this.message.success("Chỉnh sửa tuyến xe","Thành công",{timeOut:2000,progressBar:true})
        }
      }
    )
  }
  deleteRoutegory(route: any) {
    this.route = { ...route };
    let routeName ='Bạn chắc chắn xóa tuyến xe:'+
      this.route?.startPoint + ' - ' + this.route.endPoint;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: routeName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      // this.confirmDelete();
    });
  }

}
