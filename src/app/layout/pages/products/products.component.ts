
import { Component, OnInit, signal, WritableSignal} from '@angular/core';


import { ProductCardComponent } from "../../additions/product-card/product-card.component";
import { ProductService } from '../../../Core/Services/product.service';
import { CartService } from '../../../Core/Services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { Product } from '../../../Core/Interfaces/product';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [ProductCardComponent,FormsModule,CommonModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit{

 constructor(
    private readonly _ProductService: ProductService,
    private readonly _CartService: CartService,
    private readonly _ToastrService: ToastrService
  ) { }

  private productSub?: Subscription;
  private cartSub?: Subscription;
  //  products: Product[] = [];
  products:WritableSignal<Product[]> = signal([]);
  currentPage = 1;
  pageSize = 20; // Number of products per page
  totalPages = 1;
  // searchTerm: string = '';
  searchTerm:WritableSignal<string> = signal('');
  sort: string = '';

  ngOnInit(): void {
     if (!this.products || this.products.length === 0) {
    this.fetchProducts(this.currentPage);
  }
  }

  fetchProducts(page: number) {
    this.productSub?.unsubscribe();
    this.productSub = this._ProductService.getProducts(page, this.pageSize, this.sort).subscribe({
      next: res => {
        this.products.set(res.data);
        this.totalPages = res.metadata?.numberOfPages || 1;
        this.currentPage = res.metadata?.currentPage || page;
      }
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages) return;
    this.fetchProducts(page);
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  onSort(sortValue: string) {
    this.sort = sortValue;
    this.fetchProducts(1); // Reset to first page on sort
  }

  resetFilter(): void {
    this.sort = '';
    this.searchTerm.set('');
    this.fetchProducts(1); // Reset to first page on sort
  }

  ngOnDestroy(): void {
    this.productSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  
}