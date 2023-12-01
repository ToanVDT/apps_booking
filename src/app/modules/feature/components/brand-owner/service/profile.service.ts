import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, retry, delay } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(private http:HttpClient) { }

  getProfile(userId:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/profile?userId=${userId}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkExistUsername(username:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/existUsername?username=${username}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkExistPhone(phone:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/existPhone?phone=${phone}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkExistEmail(email:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/existEmail?email=${email}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkExistIdentityCode(identityCode:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/existIdentityCode?identityCode=${identityCode}`).pipe(
      retry(1), 
      delay(1000));
  }
  checkOldPasswordValid(userId:any, oldPassword:any):Observable<any>{
    return this.http.get<any>(`${environment.apiUrl}/user/password?userId=${userId}&oldPassword=${oldPassword}`).pipe(
      retry(1), 
      delay(1000));
  }
  changePassword(request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/user/changepassword`,request).pipe(
      retry(1), 
      delay(1000));
  }
  updateProfile(request:any):Observable<any>{
    return this.http.put<any>(`${environment.apiUrl}/user/update`,request).pipe(
      retry(1), 
      delay(1000));
  }
}