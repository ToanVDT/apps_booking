import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, retry } from 'rxjs';

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
}
