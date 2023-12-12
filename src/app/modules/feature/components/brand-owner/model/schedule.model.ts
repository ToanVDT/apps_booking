export class Schedule{
    id?:number;
    dateStart?:string;
    startTime?:any;
    busName?:string;
    price?:number;
    seats?:number;
    eatingFee?:number;
    routeName?:string;
    busId?:number;
}
export class ScheduleDTO{
    id?:number;
    startTime?:string;
    routeName?:string;
    shuttleId?:number;
}
export class ScheduleAvailable{
    emptySeats?:number;
    shuttleId?:number;
    scheduleId?:number;
    price?:number;
    seats?:number;
    eatingFee?:number;
    image?:string;
    brandName?:string;
    type?:string;
    busId?:string;
    startTime?:any;
    endTime?:any;
    routeId?:number;
    startPoint?:string;
    endPoint?:string;
}