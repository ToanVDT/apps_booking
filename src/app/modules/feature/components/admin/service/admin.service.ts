import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http:HttpClient) { }

  getAllCurrentBrand(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/allBrand`).pipe(
      retry(1), 
      delay(1000));
  }
  ActiveAccount(userId:any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/user/active?userId=${userId}`,null).pipe(
      retry(1), 
      delay(1000));
  }
  InactiveAccount(userId:any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/user/inactive?userId=${userId}`,null).pipe(
      retry(1), 
      delay(1000));
  }
  createAccountBrandOwner(request:any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/user`,request).pipe(
      retry(1), 
      delay(1000));
  }
  getAllCustomer(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/user/customer`).pipe(
      retry(1), 
      delay(1000));
  }
  deleteCustomer(customerId:any): Observable<any> {
    return this.http.put<any>(`${environment.apiUrl}/user/remove-customer?customerId=${customerId}`,null).pipe(
      retry(1), 
      delay(1000));
  }
}
