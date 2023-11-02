import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { AfterViewInit, Component, ElementRef, Inject, Input, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { dropoffPoints, pickupPoints } from "src/assets/data/popularRoute";
import { listSeats } from "src/assets/data/seats";

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

interface DialogData {
  message: string;
}

@Component({
  selector: 'dialog-elements-example-dialog',
  template: `<div class="flex justify-center items-center bg-gray-100">
      <div class="bg-white p-8 rounded shadow-md relative">
          <button
              mat-button
              class="absolute top-0 right-0 p-2 text-gray-500 hover:text-gray-700"
              (click)="closeDialog()"
          >
              <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
              >
                  <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M6 18L18 6M6 6l12 12"
                  ></path>
              </svg>
          </button>
          <h1 class="text-lg font-bold mb-4">{{ data.message }}</h1>
          <button
              mat-button
              class="bg-[#ffd333] text-black text-sm font-medium px-4 py-2 rounded w-full hover:bg-[#e6be2e]"
              (click)="closeDialog()"
          >
              Đã hiểu
          </button>
      </div>
  </div>`,
  standalone: true,
})
export class DialogElementsExampleDialog {
  constructor(
      public dialogRef: MatDialogRef<DialogElementsExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
  ) {}

  closeDialog(): void {
      this.dialogRef.close();
  }
}

@Component({
  selector: 'app-customer-ticket-card',
  templateUrl: './customer-ticket-card.component.html',
  styleUrls: ['./customer-ticket-card.component.scss'],
  animations: [
      trigger('imageAnimation', [
          state('*', style({ transform: 'translateX(0)' })),
          transition(':increment', [
              style({ transform: 'translateX(100%)' }),
              animate('0.3s ease-out', style({ transform: 'translateX(0)' })),
          ]),
          transition(':decrement', [
              style({ transform: 'translateX(-100%)' }),
              animate('0.3s ease-out', style({ transform: 'translateX(0)' })),
          ]),
      ]),
  ],
})
export class CustomerTicketCardComponent implements OnInit, AfterViewInit {
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
  formCheck: FormGroup;

  constructor(
      public dialog: MatDialog,
      private elementRef: ElementRef,
  ) {
      for (const seatRow of listSeats) {
          const row: Seat[] = seatRow.map((seat: any) => {
              return {
                  id: seat.id,
                  name: seat.seatName,
                  price: seat.price,
                  isBooked: seat.status === '1',
              };
          });

          this.seatPairs.push(row);
      }
      /** Test */
      this.seatPairs[1][0].isBooked = true;
      this.seatPairs[3][1].isBooked = true;
      this.seatPairs[2][3].isBooked = true;

      /* ================================== */
      this.formCheck = new FormGroup({
          check: new FormControl(this.isChecked),
          quantity: new FormControl(0),
          fullName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
          phoneNumber: new FormControl('', [Validators.pattern(/^[0-9]+$/)]),
          email: new FormControl('', [Validators.required, Validators.email]),
          termsAndConditions: new FormControl(''),
      });
  }

  ngOnInit(): void {
      this.listdropoff = dropoffPoints;
      this.listpickup = pickupPoints;
      this.listSeats = listSeats;
      this.formCheck.get('check')?.valueChanges.subscribe((value) => {
          this.isChecked = value;
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

  ngAfterViewInit() {
      this.checkOverflow();
  }

  showContent(contentNumber: number): void {
      this.selectedContent = this.selectedContent === contentNumber ? null : contentNumber;
      this.panelOpenState = this.selectedContent !== null;
  }

  @Input() images: string[] = [
      'https://static.vexere.com/production/images/1688797618225.jpeg',
      'https://static.vexere.com/production/images/1688797618903.jpeg',
      'https://static.vexere.com/production/images/1689065858222.jpeg',
      'https://static.vexere.com/production/images/1688797528210.jpeg',
      'https://static.vexere.com/production/images/1675916351798.jpeg',
      'https://static.vexere.com/production/images/1689065858222.jpeg',
      'https://static.vexere.com/production/images/1688797611253.jpeg',
  ];

  selectImage(index: number): void {
      this.selectedImageIndex = index;
  }

  prevImage(): void {
      this.selectedImageIndex = (this.selectedImageIndex - 1 + this.images.length) % this.images.length;
      this.updateStartIndex();
  }

  nextImage(): void {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.images.length;
      this.updateStartIndex();
  }

  updateStartIndex(): void {
      const maxThumbnails = 5;
      if (this.selectedImageIndex < this.startIndex) {
          this.startIndex = this.selectedImageIndex;
      } else if (this.selectedImageIndex >= this.startIndex + maxThumbnails) {
          this.startIndex = Math.max(0, this.selectedImageIndex - maxThumbnails + 1);
      }
  }

  getVisibleThumbnails(): string[] {
      const maxThumbnails = 5;
      const endIndex = Math.min(this.startIndex + maxThumbnails, this.images.length);
      return this.images.slice(this.startIndex, endIndex);
  }

  increaseQuantity() {
      const currentQuantity = this.formCheck.get('quantity')?.value || 0;
      if (currentQuantity < this.selectedSeats.length) {
          this.formCheck.get('quantity')?.setValue(currentQuantity + 1);
      } else {
          this.dialog.open(DialogElementsExampleDialog, {
              data: {
                  message: 'Bạn được chọn tối đa ' + this.selectedSeats.length + ' suất cơm',
              },
          });
      }
  }

  decreaseQuantity() {
      const currentQuantity = this.formCheck.get('quantity')?.value || 0;
      if (currentQuantity > 0) {
          this.formCheck.get('quantity')?.setValue(currentQuantity - 1);
      }
  }

  selectSeat(seat: Seat): void {
      if (!seat.isBooked) {
          const seatIndex = this.selectedSeats.findIndex((selectedSeat) => selectedSeat.id === seat.id);

          if (seatIndex === -1) {
              if (this.selectedSeats.length < 5) {
                  this.selectedSeats.push(seat);
              } else {
                  this.dialog.open(DialogElementsExampleDialog, {
                      data: {
                          message: 'Bạn được chọn tối đa 5 chỗ cho mỗi lần đặt',
                      },
                  });
              }
          } else {
              this.selectedSeats.splice(seatIndex, 1);
          }
      }
  }

  isSelected(seat: Seat): boolean {
      return this.selectedSeats.some((selectedSeat) => selectedSeat.id === seat.id);
  }

  getTotalPrice(): number {
      return this.selectedSeats.reduce((total, seat) => total + seat.price, 0);
  }

  private checkOverflow() {
      const locationLists = this.elementRef.nativeElement.querySelectorAll('.location-list');
      locationLists.forEach((list: HTMLElement) => {
          if (list.scrollHeight > list.clientHeight) {
              list.classList.remove('no-overflow');
          } else {
              list.classList.add('no-overflow');
          }
      });
  }
}