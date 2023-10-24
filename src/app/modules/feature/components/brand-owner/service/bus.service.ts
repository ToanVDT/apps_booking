import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BusService {

  constructor(private http:HttpClient) { }

  getAllBuses(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/bus?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  createOrUpdate(bus:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/bus`,bus).pipe(
      retry(1), 
      delay(1000));
  }
  deleteBus(id:any,userId:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/bus/${id}?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getType():Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/types`).pipe(
      retry(1), 
      delay(1000));
  }
  getBusForDropDown(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/bus/dropdown?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
}
