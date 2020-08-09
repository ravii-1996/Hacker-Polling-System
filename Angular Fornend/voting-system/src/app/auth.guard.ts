import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LookupService } from './lookup.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private lookupService: LookupService, private _router: Router) { }

  /**
   * We are using canActivate to restrict the aceess home page before login.
   */
    canActivate(): boolean {
      if (this.lookupService.loggedIn()) {
        return true
      } else {
        this._router.navigate(['/'])
        return false
      }
    }
}
