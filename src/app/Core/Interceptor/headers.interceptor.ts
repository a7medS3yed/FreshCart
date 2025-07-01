import { HttpInterceptorFn } from '@angular/common/http';

export const headersInterceptor: HttpInterceptorFn = (req, next) => {

  
  if (localStorage.getItem('token') !== null) {
    let headers: any = { token: localStorage.getItem('token') };

    let updatesReq = req.clone({
      setHeaders: headers
    });
    
    
    return next(updatesReq);
  }
  else {

    return next(req);
  }
};
