import { Component, EventEmitter, Inject, OnInit, Output } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DropOff } from "../../model/drop_off.model";
import { PickUp } from "../../model/pick_up.model";

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
  selector: "app-booking",
  templateUrl: "./booking.component.html",
  styleUrls: ["./booking.component.scss"],
})
export class BookingComponent implements OnInit {
  @Output() bookingTickets = new EventEmitter<any>();
  panelOpenState: boolean = false;
  selectedContent: number | null = null;
  isChecked: boolean = false;
  dropOffLocations: DropOff[] = [];
  pickupLocations: PickUp[] = [];
  selectedImageIndex = 0;
  pickup: any;
  dropOff: any;
  seats: number[] = [];
  startIndex = 0;
  listpickup: any;
  listdropoff: any;
  selectedPickup!: Location;
  selectedDropOff!: Location;
  seatPairs: Seat[][] = [];
  lastName:any;
  firstName:any
  selectedSeats: Seat[] = [];
  listSeats: any;
  isEating: boolean = false;
  quantityEating: number = 0;
  infoCustomerForm: FormGroup;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.infoCustomerForm = new FormGroup({
      isEating: new FormControl(this.isEating),
      fullName: new FormControl("", [
        Validators.required,
        Validators.pattern(/^[a-zA-Z ]+$/),
      ]),
      phoneNumber: new FormControl("", [
        Validators.pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/),
        Validators.required,
      ]),
      email: new FormControl("", [Validators.email]),
      termsAndConditions: new FormControl(""),
    });
  }

  ngOnInit(): void {
    this.seats.push(this.data.ticket?.id);
    this.pickupLocations = this.data.pickUps;
    this.dropOffLocations = this.data.dropOffs;
    this.infoCustomerForm.get("isEating")?.valueChanges.subscribe((value) => {
      if (value) {
        this.quantityEating = 1;
      } else {
        this.quantityEating = 0;
      }
    });
    this.infoCustomerForm.get("fullName")?.valueChanges.subscribe((value) => {
      this.lastName = value.split(" ").slice(0, -1).join(" ");
      this.firstName = value.split(" ").slice(-1).join(" ");
      
    });
  }
  getPickUpAndDropOff() {
    this.pickup = this.selectedPickup;
    this.dropOff = this.selectedDropOff;
  }
  bookingTicket() {
    if (this.infoCustomerForm.valid) {
      this.bookingTickets.emit({
        seatId: this.seats,
        pickUp: this.pickup?.pickUpPoint,
        dropOff: this.dropOff?.dropOffPoint,
        quantityEating: this.quantityEating,
        paymentId: 2,
        customer: {
          firstName: this.firstName,
          lastName: this.lastName,
          email: this.infoCustomerForm.value?.email,
          phoneNumber: this.infoCustomerForm.value?.phoneNumber,
        },
      });
    }
  }
}
