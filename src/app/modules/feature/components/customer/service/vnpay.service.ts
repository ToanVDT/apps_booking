import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VnpayService {

  constructor(private http: HttpClient) { }

  getURLPayment(request:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/payment/create-pay`,request).pipe()
  }
  checkGiftCodeValid(giftCode:string):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/giftcode/valid?giftCode=${giftCode}`).pipe()
  }
}
