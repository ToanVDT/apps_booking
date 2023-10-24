import { Component, OnInit, ViewChild } from "@angular/core";
import { DropOff } from "../model/drop_off.model";
import { PickUp } from "../model/pick_up.model";
import { Shuttle } from "../model/shuttle.model";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { AuthenticationService } from "../../auth/service/authentication.service";
import { ToastrService } from "ngx-toastr";
import { MatPaginator } from "@angular/material/paginator";
import { ConfirmDialogComponent } from "src/app/modules/share/components/confirm-dialog/confirm-dialog.component";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Routes } from "../model/route.model";
import { ParkingService } from "../service/parking.service";
import { finalize, forkJoin } from "rxjs";
import { RouteService } from "../service/route.service";
import { ShuttleService } from "../service/shuttle.service";
import { DialogPickUpComponent } from "./dialog-pick-up/dialog-pick-up.component";
import { DialogDropOffComponent } from "./dialog-drop-off/dialog-drop-off.component";

@Component({
  selector: "app-parking",
  templateUrl: "./parking.component.html",
  styleUrls: ["./parking.component.scss"],
})
export class ParkingComponent implements OnInit {
  displayedColumns1: string[] = ["pickUpPoint", "pickUpTime", "action"];
  displayedColumns: string[] = ["dropOffPoint", "dropOffTime", "action"];
  routeSelected: any;
  shuttles: Shuttle[] = [];
  parkingForm: FormGroup;
  dropOffs: DropOff[] = [];
  pickUps: PickUp[] = [];
  routes: Routes[] = [];
  route: Routes = {};
  dropOff: DropOff = {};
  pickUP: PickUp = {};
  shuttle: Shuttle = {};
  user: any;
  isLoading: boolean = false;

  dataSource1 = new MatTableDataSource(this.pickUps);
  dataSourceWithPageSize1 = new MatTableDataSource(this.pickUps);
  dataSource = new MatTableDataSource(this.dropOffs);
  dataSourceWithPageSize = new MatTableDataSource(this.dropOffs);

  constructor(
    private dialog: MatDialog,
    private auth: AuthenticationService,
    private message: ToastrService,
    private parkingService: ParkingService,
    private routeService: RouteService,
    private shuttleService: ShuttleService
  ) {
    this.parkingForm = new FormGroup({
      route: new FormControl(""),
      shuttle: new FormControl(""),
    });
  }

  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild("paginator1") paginator1!: MatPaginator;
  @ViewChild("paginatorPageSize") paginatorPageSize!: MatPaginator;
  @ViewChild("paginatorPageSize1") paginatorPageSize1!: MatPaginator;

  pageSizes = [3, 5, 7];

  ngAfterViewInit() {
    this.dataSource1.paginator = this.paginator1;
    this.dataSourceWithPageSize1.paginator = this.paginatorPageSize1;
    this.dataSource.paginator = this.paginator;
    this.dataSourceWithPageSize.paginator = this.paginatorPageSize;
  }

  ngOnInit(): void {
    this.user = this.auth.userValue;
    this.getRoutes();
    this.parkingForm.get("route")?.valueChanges.subscribe((value) => {
      if (value) {
        this.route = value;
        this.isLoading = true;
        this.getShuttle(this.route?.id);
      }
    });
    this.parkingForm.get("shuttle")?.valueChanges.subscribe((value) => {
      if (value) {
        this.shuttle = value;
        this.isLoading = true;
        this.getPickUpAndDropOff(this.shuttle?.id);
      }
    });
  }

  getShuttle(routeId: any) {
    this.shuttleService
      .getShuttleByRoute(routeId)
      .pipe(
        finalize(() => {
          this.getPickUpAndDropOff(this.shuttle?.id);
        })
      )
      .subscribe((data) => {
        this.shuttles = data.data;
        this.parkingForm.get("shuttle")?.setValue(this.shuttles[0]);
      });
  }
  getRoutes() {
    this.isLoading = true;
    this.routeService
      .getAllRoutes(this.user.data.id)
      .pipe(
        finalize(() => {
          this.getShuttle(this.route?.id);
        })
      )
      .subscribe((data) => {
        this.routes = data.data;
        this.parkingForm.get("route")?.setValue(this.routes[0]);
      });
  }
  openDialogPickUp(pickUp: any) {
    const dialogRef = this.dialog.open(DialogPickUpComponent, {
      data: {
        pickUp: pickUp,
      },
    });
    dialogRef.componentInstance.Update.subscribe(
      data=>{
        this.handleUpdate(data);
      }
    )
  }
  openDialogDropOff(dropOff: any) {
    const dialogRef = this.dialog.open(DialogDropOffComponent, {
      data: {
        dropOff: dropOff,
      },
    });
    dialogRef.componentInstance.Update.subscribe((data) => {
      this.handleUpdate(data);
    });
  }
  getPickUpAndDropOff(shuttleId: any) {
    forkJoin({
      pickUps: this.getpickUp(shuttleId),
      dropOffs: this.getDropOff(shuttleId),
    })
      .pipe(
        finalize(() => {
          this.dataSource1 = new MatTableDataSource(this.pickUps);
          this.dataSource = new MatTableDataSource(this.dropOffs);
          this.isLoading = false;
        })
      )
      .subscribe((data) => {
        this.pickUps = data.pickUps.data;
        this.dropOffs = data.dropOffs.data;
      });
  }
  getpickUp(shuttleId: any) {
    return this.parkingService.getAllPickUp(shuttleId).pipe();
  }
  getDropOff(shuttleId: any) {
    return this.parkingService.getAllDropOff(shuttleId).pipe();
  }
  handleUpdate(data: any) {
    this.isLoading = true;
    if (data.dropOffPoint) {
      this.parkingService
        .updateDropOff(data)
        .pipe(
          finalize(() => {
            this.getPickUpAndDropOff(this.shuttle?.id)
          
          })
        )
        .subscribe((data) => {
          if (data.success) {
            this.message.success("Cập nhập thông tin điểm trả", "Thành công", {
              timeOut: 2000,
              progressBar: true,
            });
          }
        });
    } else {
      this.parkingService
        .updatePickUp(data)
        .pipe(
          finalize(() => {
            this.getPickUpAndDropOff(this.shuttle?.id)
            
          })
        )
        .subscribe((data) => {
          if (data.success) {
            this.message.success("Cập nhập thông tin điểm đón", "Thành công", {
              timeOut: 2000,
              progressBar: true,
            });
          }
        });
    }
    let value: any;
    this.isLoading = true;
  }
  deleteParking(parking: any) {
    // this.shuttle = { ...shuttle };
    let parkingName =
      "Bạn chắc chắn xóa khung giờ:" +
      this.shuttle?.startTime +
      " - trong tuyến: " +
      this.shuttle.routeName;
    let dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { name: parkingName },
    });
    dialogRef.componentInstance.onConfirm.subscribe(() => {
      // this.confirmDelete();
    });
  }
  
}
