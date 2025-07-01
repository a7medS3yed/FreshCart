import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserAddriss } from '../Interfaces/cart';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private readonly _HttpClient:HttpClient) { }

  onlineOrder(cartId:string, userAddriss:UserAddriss) : Observable<any> {

    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=http://localhost:4200`,
      {shippingAddress: userAddriss}
    )

  }
  cashOrder(cartId:string, userAddriss:UserAddriss) : Observable<any> {

    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/orders/${cartId}`,
      {shippingAddress: userAddriss},
    )

  }

  getOrders(id:string) : Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/orders/user/${id}`);
  }
}
