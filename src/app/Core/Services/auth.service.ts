import { HttpClient } from '@angular/common/http';
import { afterNextRender, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../Interfaces/user';
import { LoginUser } from '../Interfaces/login-user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isLogging: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(private readonly _HttpClient: HttpClient) {

    afterNextRender(() => {
      if (localStorage.getItem('token')) {
        this.isLogging.next(true);
      }
      else {
        this.isLogging.next(false);
      }
    })

  }


  register(data: User): Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signup', data);
  }

  login(data: LoginUser): Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/auth/signin', data);
  }
}
