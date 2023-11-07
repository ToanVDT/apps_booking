import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ParkingService {

  constructor(private http:HttpClient) { }

  getAllPickUp(shuttleId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/pick_up?shuttleId=${shuttleId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getAllDropOff(shuttleId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/drop_offs?shuttleId=${shuttleId}`).pipe(
      retry(1), 
      delay(1000));
  }
  updateDropOff(dropOff:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/drop_off`,dropOff).pipe(
      retry(1), 
      delay(1000));
  }
  updatePickUp(pickUp:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/pick_up`,pickUp).pipe(
      retry(1), 
      delay(1000));
  }
  addPickUp(shuttleId:any,request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/pick_up?shuttleId=${shuttleId}`,request).pipe(
      retry(1), 
      delay(1000));
  }
  addDropOff(shuttleId:any,request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/drop_off?shuttleId=${shuttleId}`,request).pipe(
      retry(1), 
      delay(1000));
  }
  deletePickUp(id:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/pick_up?id=${id}`).pipe(
      retry(1), 
      delay(1000));
  }
  deleteDropOff(id:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/drop_off?id= ${id}`).pipe(
      retry(1), 
      delay(1000));
  }
}
