import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { RouteService } from '../../service/route.service';
import { Route } from '@angular/router';

@Component({
  selector: 'app-dialog-create-update-route',
  templateUrl: './dialog-create-update-route.component.html',
  styleUrls: ['./dialog-create-update-route.component.scss']
})
export class DialogCreateUpdateRouteComponent implements OnInit {

  routeForm: FormGroup;
  provinces:any;
  route!:Route;

  @Output() createOrUpdate = new EventEmitter<any>();
    
  constructor(private routeService:RouteService) {
    this.routeForm = new FormGroup({
      startPoint:new FormControl(),
      endPoint: new FormControl()
    })
   }

  ngOnInit(): void {
    this.getProvices()
  }
  getProvices(){
    this.routeService.getProvinces().pipe().subscribe(
      data=>{
        console.log("tinh", data)
        this.provinces = data
      }
    )
  }
  onSubmit(){
    
  }
}
