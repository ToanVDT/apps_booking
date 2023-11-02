import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';

interface Seat {
  id: number;
  name: string;
  price: number;
  isBooked: boolean;
}

interface Location {
  time: string;
  name: string;
}
@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  panelOpenState: boolean = false;
  selectedContent: number | null = null;
  isChecked: boolean = false;

  selectedImageIndex = 0;
  startIndex = 0;
  listpickup: any;
  listdropoff: any;
  selectedPickup!: Location;
  selectedDropOff!: Location;
  seatPairs: Seat[][] = [];
  selectedSeats: Seat[] = [];
  listSeats: any;
  isEating: boolean = false;
  infoCustomerForm:FormGroup;
  constructor(private dialog:MatDialog) {
    this.infoCustomerForm = new FormGroup({
      isEating: new FormControl(this.isEating),
      quantity: new FormControl(0),
      fullName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
      phoneNumber: new FormControl('', [Validators.pattern(/^[0-9]+$/), Validators.required]),
      email: new FormControl('', [Validators.email]),
      termsAndConditions: new FormControl(''),
  });
   }

   pickupLocations: Location[] = [
    { time: '08:00', name: 'Pickup Location 1' },
    { time: '10:30', name: 'Pickup Location 2' },
    { time: '11:30', name: 'Pickup Location 3' },
    { time: '11:45', name: 'Pickup Location 4' },
    { time: '12:00', name: 'Pickup Location 5' },
    { time: '12:30', name: 'Pickup Location 6' },
    { time: '13:00', name: 'Pickup Location 7' },
    { time: '13:30', name: 'Pickup Location 8' },
    { time: '14:00', name: 'Pickup Location 9' },
    { time: '14:15', name: 'Pickup Location 10' },
];

dropOffLocations: Location[] = [
    { time: '12:00', name: 'Drop-off Location 1' },
    { time: '03:45', name: 'Drop-off Location 2' },
    { time: '12:00', name: 'Drop-off Location 3' },
    { time: '03:45', name: 'Drop-off Location 4' },
    { time: '12:00', name: 'Drop-off Location 5' },
    { time: '03:45', name: 'Drop-off Location 6' },
    { time: '12:00', name: 'Drop-off Location 7' },
    { time: '03:45', name: 'Drop-off Location 8' },
    { time: '12:00', name: 'Drop-off Location 9' },
    { time: '03:45', name: 'Drop-off Location 10' },
];
  ngOnInit(): void {
  }

}
