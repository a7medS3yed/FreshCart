import { Component, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { ProductService } from '../../../Core/Services/product.service';
import { Category } from '../../../Core/Interfaces/product';
import { Subscription } from 'rxjs';
import { response } from 'express';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {

  constructor(private readonly _ProductService:ProductService) { }

  // categories: Category[] = [];
  categories:WritableSignal<Category[]> = signal([])
  categorySub?: Subscription;

  ngOnInit(): void {
    this.categorySub = this._ProductService.getCategories().subscribe({
      next: response => {
        this.categories.set(response.data);
      }
    })
  }

  ngOnDestroy(): void {
    this.categorySub?.unsubscribe();
  }

}
