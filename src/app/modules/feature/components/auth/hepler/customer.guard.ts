import { Injectable } from '@angular/core'
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router'
import { Observable } from 'rxjs'
import { AuthenticationService } from '../service/authentication.service';
import { AppConstant } from '../../common/constant';

@Injectable({
    providedIn: 'root',
})
export class CustomerGuard implements CanActivate {
    currentUser:any;
    constructor(private router: Router, private authenticationService: AuthenticationService) {}
    
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const user = this.authenticationService.userValue;
      
      this.currentUser = user;
      if (this.currentUser?.success && this.currentUser.data?.roles[0] === AppConstant.ROLE_CUSTOMER) {
          return true;
      } 
      else if(this.currentUser?.success && this.currentUser.data?.roles[0] === AppConstant.ROLE_ADMIN || user && this.currentUser.data?.roles[0] === AppConstant.ROLE_BRANDOWNER){
        this.router.navigate(['/forbidden'])
        return false;
      }
      else if(!this.currentUser?.success){
        return true
      }

      this.router.navigate(['/customer']);
      return false;
    }
}