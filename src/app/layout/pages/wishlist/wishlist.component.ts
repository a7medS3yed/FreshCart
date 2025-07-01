import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { WishlistService } from '../../../Core/Services/wishlist.service';
import { Subscription } from 'rxjs';

import { Product3, Wishlist } from '../../../Core/Interfaces/wishlist';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit, OnDestroy {

  constructor(private readonly _WishlistService: WishlistService, private readonly _ToastrService: ToastrService) { }

  wishSub?: Subscription;
  wishDelseteSub?: Subscription;
  products: WritableSignal<Product3[]> = signal<Product3[]>([]);
  wishList: WritableSignal<Wishlist> = signal<Wishlist>({} as Wishlist);

  ngOnInit(): void {
    this.getItem();
  }

  getItem():void {
    this.wishSub = this._WishlistService.getFromWishList().subscribe({
      next: res => {
        // Assuming your API returns { data: Product3[], ...otherWishlistData }
        this.products.set(res.data || []);
        this.wishList.set(res);
      }
    });
  }

  deleteItemFromWishList(productId: string): void {
    this.wishDelseteSub = this._WishlistService.removeFromWishList(productId).subscribe({
      next: res => {
        // this.getItem();
        const newRes = this.products().filter((item: any) => item._id !== productId);

        this.products.set(newRes);
        this._ToastrService.error('Proudct Removed Successfully');
        this._WishlistService.wishListCount.set(res.data.length);
      }
    })
  }

  ngOnDestroy(): void {
    this.wishSub?.unsubscribe();
    this.wishDelseteSub?.unsubscribe();
  }


}
