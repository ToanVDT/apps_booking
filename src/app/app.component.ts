import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'apps_booking';
  constructor(private toast:ToastrService){}
  // test(){
  //   this.toast.success("OK","success",{timeOut:2000,progressBar:true})
  // }
}
