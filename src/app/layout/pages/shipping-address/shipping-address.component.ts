import { CommonModule } from '@angular/common';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OrderService } from '../../../Core/Services/order.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { on } from 'events';

@Component({
  selector: 'app-shipping-address',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './shipping-address.component.html',
  styleUrl: './shipping-address.component.scss'
})
export class ShippingAddressComponent implements OnDestroy {

  constructor(private readonly _OrderService:OrderService,
    private readonly _ActivatedRoute:ActivatedRoute,
    private readonly _ToastrService:ToastrService,
    private readonly _Router:Router
  ) { }

  private onlineSub?: Subscription;
  private offlineSub?: Subscription;
  cartId:string = this._ActivatedRoute.snapshot.params['cartId'];

  shippingAddressForm: FormGroup = new FormGroup({
    details:new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
  })

  submitShippingAddressOnline(id:string): void {
    if (this.shippingAddressForm.invalid) {
      this.shippingAddressForm.markAllAsTouched();
      return;
    }

    this.onlineSub = this._OrderService.onlineOrder(id, this.shippingAddressForm.value).subscribe({
      next: (response) => {
        location.href = response.session.url; // Redirect to the payment page
        
      },
      error: (error) => {
        this._ToastrService.error(error.error.message, 'Error');
      }
    });
  }

  submitShippingAddressOffline(id:string): void {
    if (this.shippingAddressForm.invalid) {
      this.shippingAddressForm.markAllAsTouched();
      return;
    }

    this.offlineSub = this._OrderService.cashOrder(id, this.shippingAddressForm.value).subscribe({
      next: (response) => {
        this._ToastrService.success('Order placed successfully', 'Success');
        this._Router.navigate(['/allOrders']);
        
      },
      error: (error) => {
        this._ToastrService.error(error.error.message, 'Error');
      }
    });
  }

  ngOnDestroy(): void {
    this.onlineSub?.unsubscribe();
    this.offlineSub?.unsubscribe();
  }
}
