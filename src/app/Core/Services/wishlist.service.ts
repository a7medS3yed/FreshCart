import { HttpClient } from '@angular/common/http';
import { Injectable, signal, WritableSignal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private readonly _HttpClient:HttpClient) { }

  wishListCount:WritableSignal<number> = signal(0);

  addToWishList(productId:string) : Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/wishlist`,
      {productId:productId}
    );
  }

  removeFromWishList(productId:string) :Observable<any> {
    return this._HttpClient.delete(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`);
  }

  getFromWishList() :Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/wishlist');
  }
}
