import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShuttleService {

  constructor(private http:HttpClient) { }

  getAllShuttles(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/shuttles?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getShuttleByRoute(routeId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/shuttle?routeId=${routeId}`).pipe(
      retry(1), 
      delay(1000));
  }
  updateShuttle(shuttle:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/shuttle`,shuttle).pipe(
      retry(1), 
      delay(1000));
    }
  createShuttle(shuttle:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/shuttle`,shuttle).pipe(
      retry(1), 
      delay(1000));
    }

}
