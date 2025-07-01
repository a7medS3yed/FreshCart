import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, signal, WritableSignal } from '@angular/core';

import { RouterLink } from '@angular/router';
import { SearchPipe } from '../../../Core/Pipes/search.pipe';
import { ProductService } from '../../../Core/Services/product.service';
import { CartService } from '../../../Core/Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../../../Core/Interfaces/product';
import { FormsModule } from '@angular/forms';
import { WishlistService } from '../../../Core/Services/wishlist.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, SearchPipe, FormsModule],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.scss'
})
export class ProductCardComponent implements OnDestroy {

  constructor(
    private readonly _CartService: CartService,
    private readonly _ToastrService: ToastrService,
    private readonly _WishlistService:WishlistService
  ) { }


  private cartSub?: Subscription;
  private wishSub?: Subscription;
  @Input() products: Product[] = [];
  @Input() searchTerm: string = '';
  wishlistIds: WritableSignal<string[]> = signal([]);

  ngOnInit(){
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

  // for stars numbers 
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

  ngOnDestroy(): void {
    this.wishSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }
}
