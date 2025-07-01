import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductCardComponent } from "../../additions/product-card/product-card.component";
import { ProductService } from '../../../Core/Services/product.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Product } from '../../../Core/Interfaces/product';
import { Subscription } from 'rxjs';
import { unsubscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-products-by-category',
  standalone: true,
  imports: [ProductCardComponent, RouterLink],
  templateUrl: './products-by-category.component.html',
  styleUrl: './products-by-category.component.scss'
})
export class ProductsByCategoryComponent implements OnInit, OnDestroy {

  constructor(private readonly _ProductService: ProductService,
    private readonly _ActivatedRoute: ActivatedRoute
  ) { }

  categoryId!: string;
  // products: Product[] = [];
  products:WritableSignal<Product[]> = signal([]);
  pcSub?: Subscription;
  routeSub?: Subscription;
  flag: boolean = false;


  ngOnInit(): void {
    this.routeSub = this._ActivatedRoute.params.subscribe(params => {
      this.categoryId = params['categoryId'];
      this.pcSub?.unsubscribe();
      this.pcSub = this._ProductService.getProductsByCategoryId(this.categoryId).subscribe({
        next: res => {
          this.products.set(res.data);
        
          
          this.flag = Array.isArray(this.products()) && this.products().length > 0;
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.pcSub?.unsubscribe();
    this.routeSub?.unsubscribe();
  }

}
