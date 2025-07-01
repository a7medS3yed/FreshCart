import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../Services/auth.service';

export const routesGuard: CanActivateFn = (route, state) => {
  let _AuthService = inject(AuthService);
  let _Router = inject(Router);
 
  if(_AuthService.isLogging.getValue()) {
    return true;
  }
  else {
    _Router.navigate(['/login']);
    return false;
  }
};
