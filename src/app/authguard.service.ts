import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { GuardService } from './guard.service';

@Injectable({
  providedIn: 'root'
})
export class AuthguardService implements CanActivate {

  constructor(private guardService:GuardService, private router:Router) { }
  canActivate(route: ActivatedRouteSnapshot): boolean {
    if(this.guardService.isAutenticated()){
      return true;
    }else{
      this.router.navigate(['/login']);
      return false;
    }
  }
}
