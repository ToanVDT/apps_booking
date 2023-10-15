import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, delay, retry } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Brand } from '../model/brand.model';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private http:HttpClient) { }

  createOrUpdateBrand(brand:any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/brand`,brand).pipe(
      retry(1), 
      delay(1000));
  }
  getBrand(brandId:number): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/brand/${brandId}`).pipe(
      retry(1), 
      delay(1000));
  }
  getBrandByUserId(userId:any): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/brand?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
}