import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GuardService {
token:string="AuthToken"
  constructor() { }
  isAutenticated(){
    return !!localStorage.getItem(this.token);
  }
  
}
