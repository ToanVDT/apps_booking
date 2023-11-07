export class Orders{
    id?:number;
    orderCode?:string;
    orderDate?:string;
    totalPrice?:number;
    deposit?:number;
    orderStatus?:string;
    restPrice?:number;
    listSeat?:string[];
    paymentStatus?:string;
}

export class DetailMoney{
    giftCode?:number;
    quantityEating?:number;
    price?:number;
    eatingFee?:number;
    deposit?:number;
    totalPrice?:number;
    orderId?:number;
    quantityTicket?:number;
    restPrice?:number;
}

export class DetailInfoCustomer{
    customerName?:string;
    phoneCustomer?:string;
    email?:string;
    dropOffPoint?:string;
    pickUpPoint?:string;
}

export class DateAndTime{
    date?:any;
    time?:any;
}
export class OrderDTO{
    listSeat?:string[];
    orderDate?:any;
    orderCode?:string;
    orderStatus?:string;
    totalPrice?:number;
    deposit?:number;
    routeName?:string;
    brandName?:string;
    travelDate?:any;
    startTime?:any;
    paymentStatus?:string;
    brandPhone?:string;
    price?:number;
    eatingFee?:number;
    quantityEating?:number;
    quantityTicket?:number;
    giftMoney?:number;
    restMoney?:number;
}