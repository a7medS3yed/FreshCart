import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private readonly _HttpClient:HttpClient) { }

  getProducts(page?:number, limit?:number, sort?:string): Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?sort=${sort}&page=${page}&limit=${limit}`);
  }

  getCategories(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/categories');
  }

  getSpacificProduct(id : string) : Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
  }

  getBrands(): Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/brands');
  }


  getProductsByCategoryId(id:string) :Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?category[in]=${id}`)
  }
  getProductsByBrandId(id:string) :Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?brand[in]=${id}`)
  }
}
