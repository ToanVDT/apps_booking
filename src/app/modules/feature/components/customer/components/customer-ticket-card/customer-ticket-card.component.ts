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
import { ScheduleAvailable } from "../../../brand-owner/model/schedule.model";
import { ParkingService } from "../../../brand-owner/service/parking.service";
import { finalize, forkJoin } from "rxjs";
import { PickUp } from "../../../brand-owner/model/pick_up.model";
import { DropOff } from "../../../brand-owner/model/drop_off.model";
import { CustomerService } from "../../service/customer.service";
import { OrderService } from "../../../brand-owner/service/order.service";
import { ToastrService } from "ngx-toastr";
import { InfoCustomerReview } from "../model/infocustomerreview.model";
import { Router } from "@angular/router";
import { VnpayService } from "../../service/vnpay.service";
import { AuthenticationService } from "../../../auth/service/authentication.service";

interface Seat {
    id: number;
    name: string;
    price: number;
    isBooked: boolean;
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
    ) { }

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
    @Input() scheduleAvailable: ScheduleAvailable = {}
    @Input() images: string[] = [
        'https://static.vexere.com/production/images/1688797618225.jpeg',
        'https://static.vexere.com/production/images/1688797618903.jpeg',
        'https://static.vexere.com/production/images/1689065858222.jpeg',
        'https://static.vexere.com/production/images/1688797528210.jpeg',
        'https://static.vexere.com/production/images/1675916351798.jpeg',
        'https://static.vexere.com/production/images/1689065858222.jpeg',
        'https://static.vexere.com/production/images/1688797611253.jpeg',
    ];
    panelOpenState: boolean = false;
    selectedContent: number | null = null;
    isChecked: boolean = false;
    typeSeats = ["phòng", "chỗ"];
    typeSeat: any
    selectedImageIndex = 0;
    orderId: any
    startIndex = 0;
    paymentId: number = 1;
    brandName: any;
    pickupLocations: PickUp[] = []
    dropOffLocations: DropOff[] = []
    pickup: any;
    dropOff: any;
    giftCode: any;
    listpickup: any;
    listdropoff: any;
    eatingFee: any;
    fullName: any;
    phone: any;
    requireDeposit:boolean = false;
    email: any;
    scheduleId: any
    selectedPickup!: Location;
    selectedDropOff!: Location;
    quantityEating: number = 0;
    seatPairs: Seat[][] = [];
    selectedSeats: Seat[] = [];
    listSeats: any;
    user:any;
    isLogged:boolean = false;
    infoCustomerForm: FormGroup;
    giftMoney: number = 0;
    isLoading: boolean = false;
    totalPrice: any;
    isLoadingPage: any;
    giftForm: FormGroup
    InfoReView: InfoCustomerReview = {}
    listSeatIDSelected: number[] = [];
    listSeatName: string[] = [];
    optionForm: FormGroup
    paymentType: any;
    called: boolean = false;
    closeFormInputGift: boolean = false

    constructor(
        public dialog: MatDialog, private parkingService: ParkingService, private paymentService: VnpayService,
        private customerService: CustomerService, private orderService: OrderService,private auth:AuthenticationService,
        private elementRef: ElementRef, private message: ToastrService, private router: Router,
    ) {
        this.infoCustomerForm = new FormGroup({
            check: new FormControl(this.isChecked),
            quantity: new FormControl(0),
            fullName: new FormControl('', [Validators.required, Validators.pattern(/^[a-zA-Z ]+$/)]),
            phoneNumber: new FormControl('', [Validators.required, Validators.pattern(/^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/)]),
            email: new FormControl('', [Validators.email]),
            termsAndConditions: new FormControl(''),
        });
        this.giftForm = new FormGroup({
            giftCode: new FormControl('')
        })
        this.optionForm = new FormGroup({
            options: new FormControl('')
        })
    }

    ngOnInit(): void {
        this.user = this.auth.userValue;
        console.log("this", this.scheduleAvailable)
        if(this.user?.data?.id){
            this.isLogged = true;
            this.customerService.getProfile(this.user?.data?.id).pipe().subscribe(
                data=>{
                    this.infoCustomerForm.get("email")?.setValue(data.data.email);
                    this.infoCustomerForm.get("fullName")?.setValue(data.data.fullName);
                    this.infoCustomerForm.get("phoneNumber")?.setValue(data.data.phone);
                    this.infoCustomerForm.get("email")?.disable()
                    this.infoCustomerForm.get("fullName")?.disable()
                    this.infoCustomerForm.get("phoneNumber")?.disable()
                }
            )
        }
        this.infoCustomerForm.get('check')?.valueChanges.subscribe((value) => {
            this.isChecked = value;
        });
        if (this.scheduleAvailable?.type === 'PHONG') {
            this.typeSeat = this.typeSeats[0]
        }
        else {
            this.typeSeat = this.typeSeats[1]
        }
        this.optionForm.get('options')?.valueChanges.subscribe(
            value => {
                if (value) {
                    this.paymentType = value
                    this.checkValue(this.paymentType)
                }
            }
        )
        this.infoCustomerForm.get('quantity')?.valueChanges.subscribe(
            value => {
                this.quantityEating = value;
            }
        )
        this.infoCustomerForm.get('fullName')?.valueChanges.subscribe(value => {
            if (value) {
                this.fullName = value
            }
        })
        this.infoCustomerForm.get('email')?.valueChanges.subscribe(value => {
            this.email = value
        })
        this.infoCustomerForm.get('phoneNumber')?.valueChanges.subscribe(value => {
            if (value) {
                this.phone = value
            }
        })
        this.giftForm.get('giftCode')?.valueChanges.subscribe(
            value => {
                if (value) {
                    this.giftCode = value
                }
            }
        )
    }
    checkValue(value: any) {
        if (value == 1) {
            this.paymentId = 1
            this.closeFormInputGift = false;
        }
        else if (value == 2) {
            this.closeFormInputGift = true;
            this.paymentId = 2
        }
    }
    checkGiftCodeValid() {
        this.isLoading = true
        this.paymentService.checkGiftCodeValid(this.giftCode).pipe(finalize(() => this.isLoading = false)).subscribe(
            data => {
                if (data.success) {
                    this.message.success(data.message, "Thành công", { timeOut: 2000, progressBar: true })
                    this.giftMoney = data.data
                }
                else {
                    this.message.error(data.message, "Thất bại", { timeOut: 2000, progressBar: true })
                    this.giftForm.get("giftCode")?.setValue("")
                }
            }
        )
    }
    getValueDropOffAnfPickUp() {
        this.pickup = this.selectedPickup;
        this.dropOff = this.selectedDropOff;
    }
    getDataReview() {
        this.InfoReView.fullName = this.fullName;
        this.InfoReView.email = this.email;
        this.InfoReView.phone = this.phone;
        this.InfoReView.quantityEating = this.quantityEating;
        this.InfoReView.listSeatOrderd = this.listSeatName;
        this.InfoReView.dropOffPoint = this.dropOff?.dropOffPoint;
        this.InfoReView.pickUpPoint = this.pickup?.pickUpPoint
        this.InfoReView.brandName = this.brandName;

    }
    getDropOffPickUpAndSeat(shuttleId: any, scheduleId: any) {
        forkJoin({
            dropOffs: this.getAllFropOff(shuttleId),
            pickUps: this.getAllPickUp(shuttleId),
            seats: this.getSeatInCustomerPage(scheduleId)
        }).pipe(
            finalize(() => {
            })
        ).subscribe(
            data => {
                this.listSeats = data.seats.data,
                    this.pickupLocations = data.pickUps.data,
                    this.dropOffLocations = data.dropOffs.data
                    this.listpickup = data.pickUps.data,
                    this.listdropoff = data.dropOffs.data
                for (const seatRow of this.listSeats) {
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
            }
        )
    }
    getAllFropOff(shuttleId: any) {
        return this.parkingService.getAllDropOff(shuttleId).pipe()
    }
    getAllPickUp(shuttleId: any) {
        return this.parkingService.getAllPickUp(shuttleId).pipe()
    }
    getSeatInCustomerPage(scheduleId: any) {
        return this.customerService.getSeatForCustomerPage(scheduleId).pipe()
    }

    ngAfterViewInit() {
        this.checkOverflow();
    }

    showContent(contentNumber: number, scheduleAvailable: any): void {
        if (this.panelOpenState == false && this.called == false) {
            console.log("scheduleAvailable?.shuttleId",scheduleAvailable?.scheduleId)
            this.getDropOffPickUpAndSeat(scheduleAvailable?.shuttleId, scheduleAvailable?.scheduleId)
            this.scheduleId = scheduleAvailable?.scheduleId;
            this.eatingFee = scheduleAvailable?.eatingFee;
            this.brandName = scheduleAvailable?.brandName;
            this.called = true
        }
        this.selectedContent = this.selectedContent === contentNumber ? null : contentNumber;
        this.panelOpenState = this.selectedContent !== null;
    }



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
        const currentQuantity = this.infoCustomerForm.get('quantity')?.value || 0;
        if (currentQuantity < this.selectedSeats.length) {
            this.infoCustomerForm.get('quantity')?.setValue(currentQuantity + 1);
        } else {
            this.dialog.open(DialogElementsExampleDialog, {
                data: {
                    message: 'Bạn được chọn tối đa ' + this.selectedSeats.length + ' suất cơm',
                },
            });
        }
    }

    decreaseQuantity() {
        const currentQuantity = this.infoCustomerForm.get('quantity')?.value || 0;
        if (currentQuantity > 0) {
            this.infoCustomerForm.get('quantity')?.setValue(currentQuantity - 1);
        }
    }

    selectSeat(seat: Seat): void {
        if (!seat.isBooked) {
            const seatIndex = this.selectedSeats.findIndex((selectedSeat) => selectedSeat.id === seat.id);

            if (seatIndex === -1) {
                
                if (this.selectedSeats.length < 5) {
                    this.selectedSeats.push(seat);
                    this.listSeatIDSelected.push(seat?.id)
                    this.listSeatName.push(seat?.name)
                    if(this.selectedSeats.length >= 3){
                        this.requireDeposit = true;
                    }
                    else{
                        this.requireDeposit = false;
                    }
                } else {

                    this.dialog.open(DialogElementsExampleDialog, {
                        data: {
                            message: 'Bạn được chọn tối đa 5 chỗ cho mỗi lần đặt',
                        },
                    });
                }
            } else {
                if(this.selectedSeats.length >= 3){
                    this.requireDeposit = true;
                }
                else{
                    this.requireDeposit = false;
                }
                this.listSeatName.splice(seatIndex, 1)
                this.selectedSeats.splice(seatIndex, 1);
                this.listSeatIDSelected.splice(seatIndex, 1);
            }
        }
    }

    isSelected(seat: Seat): boolean {
        return this.selectedSeats.some((selectedSeat) => selectedSeat.id === seat.id);
    }

    getTotalPrice(): number {
        let promotion = 0;
        if (this.paymentId === 1) {
            promotion = this.giftMoney;
        }
            this.totalPrice = this.selectedSeats.reduce((total, seat) => total + seat.price, 0) + this.quantityEating * this.eatingFee - promotion;
        return this.totalPrice;
    }
    getPromotion() {

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
    bookingTicket() {
        this.isLoadingPage  = true;
        let gift: any;
        let payAmount: any;
        if (this.paymentId === 2) {
            gift = "";
            payAmount = 0;
        }
        else {
            gift = this.giftCode;
            if(this.requireDeposit){
                payAmount = this.totalPrice*0.6;
            }
            else{
                payAmount = this.totalPrice;
            }
        }
        let request = {
            seatId: this.listSeatIDSelected,
            pickUp: this.pickup?.pickUpPoint,
            dropOff: this.dropOff?.dropOffPoint,
            quantityEating: this.quantityEating,
            scheduleId: this.scheduleId,
            paymentId: this.paymentId,
            giftCode: gift,
            paidAmount: payAmount,
            customer: {
                firstName: this.fullName.split(" ").slice(0, -1).join(" "),
                lastName: this.fullName.split(" ").slice(-1).join(" "),
                email: this.email,
                phoneNumber: this.phone,
            }
        }
        // console.log(request)
        this.orderService.orderTicket(request).pipe(
            finalize(()=>{
                this.isLoadingPage = false
            })
        ).subscribe(
            data => {
                if (data.success) {
                    this.message.success("Đặt vé", "Thành công", { timeOut: 2000, progressBar: true })
                }
                // this.router.navigate(['/customer'])
            }
        )
    }
    paymentOrder() {
        let gift: any;
        let payAmount: any;
        console.log("tprice", this.totalPrice)
        if (this.paymentId === 2) {
            gift = "";
            payAmount = 0;
        }
        else {
            gift = this.giftCode
            if(this.requireDeposit){
                payAmount = this.totalPrice*0.6;
            }
            else{
                payAmount = this.totalPrice;
            }
        }
        let request = {
            seatId: this.listSeatIDSelected,
            pickUp: this.pickup?.pickUpPoint,
            dropOff: this.dropOff?.dropOffPoint,
            quantityEating: this.quantityEating,
            scheduleId: this.scheduleId,
            paymentId: this.paymentId,
            giftCode: gift,
            paidAmount: payAmount,
            customer: {
                firstName: this.fullName.split(" ").slice(0, -1).join(" "),
                lastName: this.fullName.split(" ").slice(-1).join(" "),
                email: this.email,
                phoneNumber: this.phone,
            }
        }
        localStorage.setItem("dataBooking", JSON.stringify(request))
        let requestPayment = { amount: payAmount, bankCode: "NCB" }
        this.paymentService.getURLPayment(requestPayment).pipe().subscribe(
            data => {
                window.location.href = data.data;
            }
        )
    }
}