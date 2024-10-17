import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { GuardService } from './guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private guardService:GuardService, private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(this.guardService.isAuthenticated()){
      const expectedRole = route.data['role'];
      const userRole = this.guardService.getUserRole();

      if (expectedRole === userRole) {
        return true;
      } else {
        this.router.navigate(['/not-found']);
        return false;
      }
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
