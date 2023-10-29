export class Schedule{
    id?:number;
    dateStart?:string;
    startTime?:string;
    busName?:string;
    price?:number;
    seats?:number;
    eatingFee?:number;
    routeName?:string;
}
export class ScheduleDTO{
    id?:number;
    startTime?:string;
    routeName?:string;
}