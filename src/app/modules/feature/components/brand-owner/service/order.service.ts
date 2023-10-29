import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, delay, retry } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrderInSchedule(scheduleId: any): Observable<any> {
    return this.http
      .get<any>(`${environment.apiUrl}/orders?scheduleId=${scheduleId}`)
      .pipe(retry(1), delay(1000));
  }
  orderTicket(order: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/order`, order)
      .pipe(retry(1), delay(1000));
  }

  cancelTicket(orderId: any): Observable<any> {
    return this.http
      .post<any>(`${environment.apiUrl}/order/cancel?orderId=${orderId}`, null)
      .pipe(retry(1), delay(1000));
  }
  approvalOrder(orderId: any): Observable<any> {
    return this.http
      .post<any>(
        `${environment.apiUrl}/order/approval?orderId=${orderId}`,
        null
      )
      .pipe(retry(1), delay(1000));
  }
  getOrderByOrderCode(orderCode:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/order?orderCode=${orderCode}`).pipe(
      retry(1), 
      delay(1000));
}
}
