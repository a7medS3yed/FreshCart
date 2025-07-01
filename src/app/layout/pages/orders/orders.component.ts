import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { Subscription } from 'rxjs';
import { OrderService } from '../../../Core/Services/order.service';
import { Order } from '../../../Core/Interfaces/order';
import { CommonModule } from '@angular/common';

interface MyJwtPayload {
  id: string;
  // add other properties if needed
  [key: string]: any;
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent implements OnInit, OnDestroy {

  constructor(private readonly _OrderService:OrderService) { }

  token: any = localStorage.getItem('token');
  // Decode the token to get user information
  decodeToken: MyJwtPayload = jwtDecode<MyJwtPayload>(this.token);
  orderSub?:Subscription;
  // ordersList:Order[] = [];
  ordersList:WritableSignal<Order[]> = signal([]);
  

  ngOnInit(): void {
    this.orderSub = this._OrderService.getOrders(this.decodeToken.id).subscribe({
      next: (response) => {
        // console.log('Orders fetched successfully:', response);
        this.ordersList.set(response); 
      }
    })
    
  }

 ngOnDestroy(): void {
   this.orderSub?.unsubscribe();
 }
  
}
