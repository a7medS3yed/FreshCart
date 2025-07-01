
import { Component, OnDestroy, OnInit, WritableSignal, signal } from '@angular/core';
import { ProductService } from '../../../Core/Services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Product } from '../../../Core/Interfaces/product';
import { CommonModule } from '@angular/common';

import { CartService } from '../../../Core/Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { WishlistService } from '../../../Core/Services/wishlist.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent implements OnInit, OnDestroy {

  constructor(private readonly _ProductService: ProductService,
    private readonly _ActivatedRoute: ActivatedRoute,
    private readonly _CartService:CartService,
    private readonly _ToastrService:ToastrService,
    private readonly _WishlistService:WishlistService
  ) { }

  detailsSub?: Subscription;
  cartSub?: Subscription;
  wishSub?: Subscription;
  product:WritableSignal<Product> = signal({} as Product);
  wishlistIds: WritableSignal<string[]> = signal([]);


  ngOnInit(): void {
    this.detailsSub = this._ProductService.getSpacificProduct(this._ActivatedRoute.snapshot.params['id']).subscribe({
      next: (response) => {
        this.product.set(response.data);
      }
    })

    // Fetch wishlist IDs
    this._WishlistService.getFromWishList().subscribe({
      next: res => {
        this.wishlistIds.set(res.data.map((p: any) => p._id));
      }
    });
  }

   addToCart(id: string) {
    this.cartSub = this._CartService.addProductToCart(id).subscribe({
      next: (response) => {
        this._ToastrService.success('Product added to cart successfully!');
        this._CartService.count.set(response.numOfCartItems);
      }
    });
  }

   addToWishlist(productId: string) {
    this.wishSub = this._WishlistService.addToWishList(productId).subscribe({
      next: res => {
        this._ToastrService.success('Product added to wish list successfully!');
        this._WishlistService.wishListCount.set(res.data.length);
        this.wishlistIds.set(res.data); // res.data is an array of product IDs
      }
    });
  }

  ngOnDestroy(): void {
    this.detailsSub?.unsubscribe();
    this.cartSub?.unsubscribe();
    this.wishSub?.unsubscribe();
  }

  selectImage(img: string): void {
    this.product().imageCover = img;
  }


  // for starts numbers 
  getFullStars(rating: number): number[] {
    return Array(Math.floor(rating)).fill(0);
  }

  shouldShowHalfStar(rating: number): boolean {
    const decimal = rating % 1;
    return decimal > 0 && decimal < 0.8; // Show half star for 0.1-0.7
  }

  getEmptyStars(rating: number): number[] {
    const fullStars = Math.floor(rating);
    const hasHalf = this.shouldShowHalfStar(rating);
    const emptyCount = 5 - fullStars - (hasHalf ? 1 : 0);
    return Array(Math.max(0, emptyCount)).fill(0);
  }

}
