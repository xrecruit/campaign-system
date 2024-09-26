import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(public localStorageService: LocalStorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const accessToken = this.localStorageService.getToken();

    req = req.clone({
      setParams: {
        'account-name': 'devrecruit'
      },
      headers: req.headers.set('SecretKey', 'MBw[;Rv]-6M]&3P2Grb'),
    });

    return next.handle(req);
  }

}
