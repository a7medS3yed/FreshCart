import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private readonly _HttpClient:HttpClient) { }
  // count: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  count:WritableSignal<number> = signal(0);

  addProductToCart(id:string):Observable<any> {
    return this._HttpClient.post('https://ecommerce.routemisr.com/api/v1/cart', {productId: id},
      
    )
  }

  getCartItems() : Observable<any>  {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/cart')
  }

  updateCartItemCount(id:string, count:number):Observable<any> {
    return this._HttpClient.put(`https://ecommerce.routemisr.com/api/v1/cart/${id}`, {count: count},
     
    )
  }

  deleteCartItem(id:string):Observable<any> {
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/cart/${id}`)
  }

  clearCart():Observable<any> {
    return this._HttpClient.delete('https://ecommerce.routemisr.com/api/v1/cart')
  }
}
