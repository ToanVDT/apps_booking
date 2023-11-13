import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.scss']
})
export class PaymentFailedComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  backToHomePage(){
    localStorage.removeItem('dataBooking')
    this.router.navigate(["/customer"])
  }
}
