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
}
