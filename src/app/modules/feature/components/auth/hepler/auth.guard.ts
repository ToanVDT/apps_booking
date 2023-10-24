import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../service/authentication.service';
import { AppConstant } from '../../common/constant';

@Injectable({
    providedIn: 'root',
})
export class AuthGuard implements CanActivate {
    currentUser:any;
    constructor(private router: Router, private authenticationService: AuthenticationService) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = this.authenticationService.userValue;
      this.currentUser = user;
      if (user && this.currentUser.data?.roles[0] === AppConstant.ROLE_BRANDOWNER) {
          return true;
      } 
      else if(user && this.currentUser.data?.roles[0] === AppConstant.ROLE_ADMIN){
        this.router.navigate(['/unauthorized'])
        return false;
      }

      this.router.navigate(['/auth'], { queryParams: { returnUrl: state.url } });
      return false;
    }
}