import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { authService } from '../services/auth.service';

@Injectable()
export class PrivilegeGuard implements CanActivate {

  constructor(private authservice: authService) {

  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    let privileges = next.data.privileges as Array<string>;
    // find any privilege user has 
    return this.authservice.hasAnyPrivilege(privileges); 

  }
}
