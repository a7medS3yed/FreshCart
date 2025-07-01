import { Component, computed, OnDestroy, OnInit, Signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../Core/Services/auth.service';
import { Subscription } from 'rxjs';
import { CartService } from '../../../Core/Services/cart.service';
import { WishlistService } from '../../../Core/Services/wishlist.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent implements OnInit, OnDestroy {

  showLogin: boolean = false;
  private loginSub?: Subscription;
  private cartSub?: Subscription;
  private wishtSub?: Subscription;
  cartCount: Signal<number> = computed(() => this._CartService.count());
  wishCount: Signal<number> = computed(() => this._WishlistService.wishListCount());

  constructor(private readonly _AuthService: AuthService, private readonly _Router: Router, private readonly _CartService: CartService, private readonly _WishlistService: WishlistService) { }

  ngOnInit() {

    if (typeof localStorage !== 'undefined') {

      this.cartSub = this._CartService.getCartItems().subscribe({
        next: res => {
          this._CartService.count.set(res.numOfCartItems);
        }


      });

      this.wishtSub = this._WishlistService.getFromWishList().subscribe({
        next: res => {
          this._WishlistService.wishListCount.set(res.count);
        }
      })
    }

    this.loginSub = this._AuthService.isLogging.subscribe(res => {
      this.showLogin = res;



    })

  }

  logout(): void {
    localStorage.removeItem('token');
    this._AuthService.isLogging.next(false);
    this._Router.navigate(['/login']);
  }


  ngOnDestroy() {
    this.loginSub?.unsubscribe();
  }


  confirmBox() {
  Swal.fire({
    title: 'Are you sure you want to log out?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, log out',
    cancelButtonText: 'Cancel',
    reverseButtons: true,
    customClass: {
      confirmButton: 'btn btn-danger mx-2',
      cancelButton: 'btn btn-secondary'
    },
    buttonsStyling: false
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: 'Logged out!',
        text: 'You have been successfully logged out.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      this.logout(); // 🔒 Your logout logic here
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire({
        title: 'Cancelled',
        text: 'You are still logged in 😊',
        icon: 'info',
        timer: 1200,
        showConfirmButton: false
      });
    }
  });
}
}
