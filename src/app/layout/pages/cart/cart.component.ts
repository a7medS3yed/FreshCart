import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { CartService } from '../../../Core/Services/cart.service';
import { Subscription } from 'rxjs';
import { Cart, Product2 } from '../../../Core/Interfaces/cart';
import { LoaderComponent } from '../../additions/loader/loader.component';
import { ToastrService } from 'ngx-toastr';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit, OnDestroy {

  constructor(private readonly _CartService: CartService, private readonly _ToastrService: ToastrService) { }

  private cartSub?: Subscription;
  private UpdateCartSub?: Subscription;
  private DeleteItemSub?: Subscription;
  private clearSub?: Subscription;
  // cartItem : Product2[]  = [];
  cartItem: WritableSignal<Product2[]> = signal<Product2[]>([]);
  // cart!: Cart;
  cart: WritableSignal<Cart> = signal<Cart>({} as Cart);


  ngOnInit(): void {
    this.cartSub = this._CartService.getCartItems().subscribe({
      next: (response) => {
        this.cart.set(response)
        this.cartItem.set(response.data.products);
      }
    });
  }

  updateCartItemCount(id: string, count: number): void {

    this.UpdateCartSub = this._CartService.updateCartItemCount(id, count).subscribe({
      next: (response) => {
        this.cart.set(response)
        this.cartItem.set(response.data.products);
        this._ToastrService.success('Cart item updated successfully');
      }
    });
  }

  deleteCartItem(id: string): void {

    this.DeleteItemSub = this._CartService.deleteCartItem(id).subscribe({
      next: (response) => {
        this.cart.set(response)
        this.cartItem.set(response.data.products);
        this._CartService.count.set(response.numOfCartItems);
        // this._ToastrService.error('Cart item deleted successfully');
      },

    });
  }

  clearCart(): void {

    this.clearSub = this._CartService.clearCart().subscribe({
      next: (response) => {
        this.cartItem.set([]);
        this._CartService.count.set(0);
        console.log(this._CartService.count());
        
        // this._ToastrService.error('Cart cleared successfully');
      },
    });
  }

  ngOnDestroy(): void {
    this.cartSub?.unsubscribe();
    this.UpdateCartSub?.unsubscribe();
    this.DeleteItemSub?.unsubscribe();
    this.clearSub?.unsubscribe();
  }




confirmBox(id?: string) {
  Swal.fire({
    title: 'Are you sure?',
    text: id 
      ? 'This product will be removed from your cart.'
      : 'This will clear your entire cart.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-danger me-2',
      cancelButton: 'btn btn-secondary me-2'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Deleted!',
        text: id
          ? 'The product has been removed from your cart.'
          : 'Your cart has been cleared.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      if (id) {
        this.deleteCartItem(id);
      } else {
        this.clearCart();
      }

    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Cancelled',
        text: 'Your cart is safe 😊',
        icon: 'info',
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}



}
