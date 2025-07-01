import { OwlOptions } from './../../../../../node_modules/ngx-owl-carousel-o/lib/models/owl-options.model.d';
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../Core/Services/product.service';
import { Subscription } from 'rxjs';
import { Category, Product } from '../../../Core/Interfaces/product';
import { LoaderComponent } from "../../additions/loader/loader.component";

import { CategorySliderComponent } from "../../additions/category-slider/category-slider.component";
import { RouterLink } from '@angular/router';
import { CartService } from '../../../Core/Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { MainSliderComponent } from '../../additions/main-slider/main-slider.component';
import { WishlistService } from '../../../Core/Services/wishlist.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CategorySliderComponent, RouterLink, MainSliderComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit, OnDestroy {

  private productsSub?: Subscription;
  private categoriesSub?: Subscription;
  private cartSub?: Subscription;
  private wishSub?: Subscription;
  // products: Product[] = [];
  products: WritableSignal<Product[]> = signal([]);
  // cateogries: Category[] = [];
  cateogries: WritableSignal<Category[]> = signal([]);
  wishlistIds: WritableSignal<string[]> = signal([]);

  constructor(
    private readonly _ProductService: ProductService,
    private readonly _CartService: CartService,
    private readonly _ToastrService: ToastrService,
    private readonly _WishlistService: WishlistService
  ) { }

  ngOnInit(): void {

    this.productsSub = this._ProductService.getProducts().subscribe({
      next: (response) => {
        this.products.set(response.data);
      }
    })

    this.categoriesSub = this._ProductService.getCategories().subscribe({
      next: (res) => {
        this.cateogries.set(res.data);
      }
    })

    // Fetch wishlist IDs
    this._WishlistService.getFromWishList().subscribe({
      next: res => {
        this.wishlistIds.set(res.data.map((p: any) => p._id));
      }
    });
  }

  ngOnDestroy(): void {
    this.productsSub?.unsubscribe();
    this.categoriesSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }


  addToCart(id: string) {
    this.cartSub = this._CartService.addProductToCart(id).subscribe({
      next: (response) => {

        this._ToastrService.success('Product added to cart successfully!');
        this._CartService.count.set(response.numOfCartItems);
      }
    })
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
