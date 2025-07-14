import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from '@angular/router';
import { TokenService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private tokenService: TokenService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const allowedRoles = route.data['roles'] as Array<string> || [];
    const userRole = this.tokenService.getRole();
  
    console.log('Guard check - allowedRoles:', allowedRoles, 'userRole:', userRole);
  
    if (allowedRoles.length === 0) {
      return true;
    }
  
    if (userRole && allowedRoles.includes(userRole)) {
      return true;
    }
  
    this.router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }  
}