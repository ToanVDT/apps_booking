import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http:HttpClient) { }

  registerCustomer(request:any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user/customer`,request).pipe(
      retry(1), 
      delay(1000));
  }
  checkPhoneRegisterCustomer(phone:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/existPhoneRegisterCustomer?phone=${phone}`).pipe(
      retry(1), 
      delay(1000));
  }
 getProfile(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/profile-customer?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  updateProfile(request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/user/profile-customer`,request).pipe(
      retry(1), 
      delay(1000));
  }
  getCurrentOrder(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/order/current?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getPastOrder(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/order/past?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getCanceledOrder(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/order/canceled?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getGiftCode(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/giftcode?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getScheduleAvailable(startPoint:any,endPoint:any,travelDate:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/shuttles/search?startPoint=${startPoint}&endPoint=${endPoint}&travelDate=${travelDate}`).pipe(
      retry(1), 
      delay(1000));
  }
  getSeatForCustomerPage(scheduleId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/seats?scheduleId=${scheduleId}`).pipe(
      retry(1), 
      delay(1000));
  }
  sendMailValidateCode(email:string):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/sendValidateCode?email=${email}`).pipe(
      retry(1), 
      delay(1000));
  }
  resetPassword(email:string):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/user/resetPassword?email=${email}`,null).pipe(
      retry(1), 
      delay(1000));
  }
}
