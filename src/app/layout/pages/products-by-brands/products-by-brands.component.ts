import { Component, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../Core/Services/product.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../../Core/Interfaces/product';
import { Subscription } from 'rxjs';
import { ProductCardComponent } from '../../additions/product-card/product-card.component';

@Component({
  selector: 'app-products-by-brands',
  standalone: true,
  imports: [ProductCardComponent],
  templateUrl: './products-by-brands.component.html',
  styleUrl: './products-by-brands.component.scss'
})
export class ProductsByBrandsComponent {

  constructor(private readonly _ProductService: ProductService,
      private readonly _ActivatedRoute: ActivatedRoute
    ) { }
  
    brandId!: string;
    // products: Product[] = [];
    products:WritableSignal<Product[]> = signal([]);
    pcSub?: Subscription;
    routeSub?: Subscription;
    flag: boolean = false;
  
  
    ngOnInit(): void {
      this.routeSub = this._ActivatedRoute.params.subscribe(params => {
        this.brandId = params['brandId'];
        this.pcSub?.unsubscribe();
        this.pcSub = this._ProductService.getProductsByBrandId(this.brandId).subscribe({
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
