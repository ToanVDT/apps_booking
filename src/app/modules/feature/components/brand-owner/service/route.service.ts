import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, retry } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  constructor(private http:HttpClient) { }
  getProvinces():Observable<any>{
    return this.http.get<any>(`https://provinces.open-api.vn/api/p/`).pipe(
      retry(1),
      delay(1000)
    )
  }
  getAllRoutes(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/routes?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  createOrUpdate(route:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/route`,route).pipe(
      retry(1), 
      delay(1000));
  }
  deleteRoute(id:any, userId:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/route/${id}?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
}
