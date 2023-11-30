import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ImageService {

  constructor(private http:HttpClient) { }

  addImage(file:any,busId:any):Observable<any>{
    return this.http.post<any>(`${environment.apiUrl}/image/${busId}`,file).pipe(
      retry(1), 
      delay(1000));
  }
  getImage(busId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/image/${busId}`).pipe(
      retry(1), 
      delay(1000));
  }
  deleteImage(imageId:any):Observable<any>{
    return this.http.delete<any>(`${environment.apiUrl}/image/${imageId}`).pipe(
      retry(1), 
      delay(1000));
  }
  updateImage(file:any,imgId:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/image/${imgId}`,file).pipe(
      retry(1), 
      delay(1000));
  }
}
