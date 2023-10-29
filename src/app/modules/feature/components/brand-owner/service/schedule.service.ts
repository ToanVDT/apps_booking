import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  constructor(private http:HttpClient) { }

  getAllSchedule(routeId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/schedules?routeId=${routeId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getScheduleByTravelDate(dateStart:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/schedulebytraveldate?dateStart=${dateStart}`).pipe(
      retry(1), 
      delay(1000));
  }
  createSchedule(schedule:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/schedule`,schedule).pipe(
      retry(1), 
      delay(1000));
  }
  updateSchedule(schedule:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/schedule`,schedule).pipe(
      retry(1), 
      delay(1000));
  }
}
