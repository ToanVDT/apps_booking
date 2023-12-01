import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { OrderService } from 'src/app/modules/feature/components/brand-owner/service/order.service';

@Component({
  selector: 'app-payment-success',
  templateUrl: './payment-success.component.html',
  styleUrls: ['./payment-success.component.scss']
})
export class PaymentSuccessComponent implements OnInit {

  isLoading: boolean = true;
  isShow: boolean = false
  constructor(private orderService: OrderService, private router: Router) { }

  ngOnInit(): void {
    let request = JSON.parse(localStorage.getItem('dataBooking') || '{}');
    this.orderTicket(request)

  }
  orderTicket(request: any) {
    this.isLoading = true;
    this.orderService.orderTicket(request).pipe(
      finalize(() => {
        localStorage.removeItem('dataBooking')
        this.isLoading = false;
        this.isShow = true;
      }
      )
    ).subscribe()
  }
  backToHomePage() {
    localStorage.removeItem('dataBooking')
    this.router.navigate(["/customer"])
  }

}
