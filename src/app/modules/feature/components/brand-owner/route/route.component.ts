import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogCreateUpdateRouteComponent } from './dialog-create-update-route/dialog-create-update-route.component';
import { Route } from '@angular/router';
import { AuthenticationService } from '../../auth/service/authentication.service';
import { RouteService } from '../service/route.service';
import { ToastrService } from 'ngx-toastr';
import { finalize, forkJoin } from 'rxjs';
import { Routes } from '../model/route.model';
import { ConfirmDialogComponent } from 'src/app/modules/share/components/confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-route',
  templateUrl: './route.component.html',
  styleUrls: ['./route.component.scss']
})
export class RouteComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = [
    'startPoint',
    'endPoint',
    'action'
  ];
  provinces:any;
  routes : Routes[] = [];
  route : Routes = {}
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
    this.getRouteAndProvinces()
  }
  openFormAddRoute(route:any){
    const dialogRef =this.dialog.open(DialogCreateUpdateRouteComponent,{
      data:{
        route:route,
        provinces: this.provinces
      }
    })
    dialogRef.componentInstance.createOrUpdate.subscribe(
      data=>{
        this.handleCreateOrUpdate(data)
      }
    )
  }
  getRouteAndProvinces(){
    forkJoin({
      routes:this.getRoutes(),
      provinces:this.getProvinces()
    }).pipe(
      finalize(()=>{
        this.dataSource = new MatTableDataSource(this.routes)
        this.isLoading = false;
      })
    ).subscribe(
      data=>{
        this.routes = data.routes.data;
        this.provinces = data.provinces
      }
    )
  }
  getRoutes(){
    this.isLoading = true;
    return this.routeService.getAllRoutes(this.user.data.id)
  }
  getProvinces(){
    return this.routeService.getProvinces();
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
  deleteRoutegory(route: Routes) {
    this.route = { ...route };
    let routeName ='Bạn chắc chắn xóa tuyến xe:'+
      this.route?.startPoint + ' - ' + this.route.endPoint;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: routeName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      this.confirmDelete(route.id);
    });
  }
  confirmDelete(routeId:any){
    this.isLoading = true;
    let value:any;
    this.routeService.deleteRoute(routeId, this.user.data?.id).pipe(
      finalize(()=>{
        this.isLoading = false;
        this.dataSource = new MatTableDataSource(value);
      })
    ).subscribe(
      data=>{
        if(data.success){
          this.message.success("Xóa tuyến đường", "Thành công",{timeOut:2000, progressBar:true})
          value = data.data
        }
        else{
          this.getRouteAndProvinces()
          this.message.error(data.message,"Xoá thất bại",{timeOut:2000, progressBar:true})
        }
      }
    )
  }
}
