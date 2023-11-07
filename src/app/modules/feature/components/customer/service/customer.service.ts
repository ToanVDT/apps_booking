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
}
