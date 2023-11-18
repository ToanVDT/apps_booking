import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { User } from '../../../model/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private userSubject: BehaviorSubject<User | null>;
  public user: Observable<User | null>;

  constructor(private http: HttpClient, private router: Router) {
    this.userSubject = new BehaviorSubject(
      JSON.parse(localStorage.getItem('user')!)
    );
    this.user = this.userSubject.asObservable();
  }
  public get userValue() {
    return this.userSubject.value;
  }
  login(username: string, password: string) {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/signin`, { username, password })
      .pipe(
        map((user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.userSubject.next(user);
          return user;
        })
      );
  }
  logout() {
    localStorage.removeItem('user');
    this.userSubject.next(null);
  }
  refreshToken() {
    return this.http
      .post<any>(`${environment.apiUrl}/auth/refreshtoken`, {
        refreshToken: this.userValue?.refreshToken,
      })
      .pipe(
        map((data) => {
          if (this.userValue) {
            this.userValue.accessToken = data.accessToken;
            this.userValue.refreshToken = data.refreshToken;
            this.userSubject.next(this.userValue);
            localStorage['user'] = JSON.stringify(this.userValue);
            return this.userValue;
          } else {
            this.router.navigate(['/auth']);
            return null;
          }
        })
      );
  }
}