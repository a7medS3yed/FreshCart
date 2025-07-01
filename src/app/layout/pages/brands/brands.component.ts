import { Category } from './../../../Core/Interfaces/product';
import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../Core/Services/product.service';
// If you have a Brand interface, import it instead of Category
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit, OnDestroy {

  constructor(private readonly _ProductService: ProductService) { }

  brandSub?: Subscription;
  // brands: Category[] = [];
  brands: WritableSignal<Category[]> = signal<Category[]>([]);

  ngOnInit() {
    this.brandSub = this._ProductService.getBrands().subscribe({
      next: res => {
        // this.brands = res.data;
        this.brands.set(res.data);
      }
    });
  }

  ngOnDestroy(): void {
    this.brandSub?.unsubscribe();
  }
}