import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http:HttpClient){}

  getSeatInTicketPage(scheduleId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/seat?scheduleId=${scheduleId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getEmptySeat(dateStart:any,scheduleId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/empty_seat?dateStart=${dateStart}&scheduleId=${scheduleId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getSeatWithStatus(scheduleId:any,status:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/seat/status?scheduleId=${scheduleId}&status=${status}`).pipe(
      retry(1), 
      delay(1000));
  }
}
