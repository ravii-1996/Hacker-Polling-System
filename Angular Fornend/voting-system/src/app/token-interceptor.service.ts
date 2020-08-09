import { LookupService } from './lookup.service';
import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor } from '@angular/common/http'
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  constructor(private injector: Injector){}

  /**
   * We set token in the header of req which will be verifyig by backend is that token same or not
   * If forcefully token change then user doesn't have access
   * we have to make clone of req bcz it is immutable.
   */
  intercept(req, next) {
    let authService = this.injector.get(LookupService)
    let tokenizedReq = req.clone(
      {
        headers: req.headers.set('Authorization', 'bearer ' + authService.getToken())
      }
    )
    return next.handle(tokenizedReq)
  }
}
