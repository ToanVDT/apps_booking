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