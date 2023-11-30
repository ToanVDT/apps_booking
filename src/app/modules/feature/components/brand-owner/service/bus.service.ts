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
  deleteBus(id:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/bus/${id}`).pipe(
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
  getBusForDropDownByTravelDate(userId:any, travelDate:any,startTime:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/bus/dropdown1?userId=${userId}&travelDate=${travelDate}&startTime=${startTime}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkDuplicateBusName(name:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/bus/duplicateName?name=${name}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkDuplicateIdentityCode(identityCode:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/bus/duplicateIdentityCode?identityCode=${identityCode}`).pipe(
      retry(1), 
      delay(1000));
  }
  getImageBus(busId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/image/${busId}`).pipe(
      retry(1), 
      delay(1000));
  }
  addImage(files:any,busId:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/image/${busId}`,files).pipe(
      retry(1), 
      delay(1000));
  }
  changeImage(files:any,imgId:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/image/${imgId}`,files).pipe(
      retry(1), 
      delay(1000));
  }
  removeImage(imageId:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/image/${imageId}`).pipe(
      retry(1), 
      delay(1000));
  }
}
