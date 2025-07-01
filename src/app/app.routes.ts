import { Component } from '@angular/core';
import { Routes } from '@angular/router';
import { HomeComponent } from './layout/pages/home/home.component';
import { ProductsComponent } from './layout/pages/products/products.component';
import { BrandsComponent } from './layout/pages/brands/brands.component';
import { CategoriesComponent } from './layout/pages/categories/categories.component';
import { CartComponent } from './layout/pages/cart/cart.component';
import { LoginComponent } from './layout/pages/login/login.component';
import { RegisterComponent } from './layout/pages/register/register.component';
import { NotfoundComponent } from './layout/additions/notfound/notfound.component';
import { routesGuard } from './Core/Guards/routes.guard';
import { ProductDetailsComponent } from './layout/pages/product-details/product-details.component';
import { ShippingAddressComponent } from './layout/pages/shipping-address/shipping-address.component';
import { OrdersComponent } from './layout/pages/orders/orders.component';
import { ProductsByCategoryComponent } from './layout/pages/products-by-category/products-by-category.component';
import { ProductsByBrandsComponent } from './layout/pages/products-by-brands/products-by-brands.component';


export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full', title: 'FreshCart - Home' },

  // Eager loaded (critical routes)
  { path: 'home', component: HomeComponent, title: 'FreshCart - Home', canActivate: [routesGuard] },
  { path: 'products', component: ProductsComponent, title: 'FreshCart - Products', canActivate: [routesGuard] },
  { path: 'productDetails/:id', component: ProductDetailsComponent, title: 'FreshCart - Product Details', canActivate: [routesGuard] },

  // Lazy loaded (less critical)
  {
    path: 'brands',
    loadComponent: () => import('./layout/pages/brands/brands.component').then(m => m.BrandsComponent),
    title: 'FreshCart - Brands',
    canActivate: [routesGuard]
  },
  {
    path: 'categories',
    loadComponent: () => import('./layout/pages/categories/categories.component').then(m => m.CategoriesComponent),
    title: 'FreshCart - Categories',
    canActivate: [routesGuard]
  },
  {
    path: 'cart',
    loadComponent: () => import('./layout/pages/cart/cart.component').then(m => m.CartComponent),
    title: 'FreshCart - Cart',
    canActivate: [routesGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./layout/pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    title: 'FreshCart - Wish List',
    canActivate: [routesGuard]
  },
  {
    path: 'shipping/:cartId',
    loadComponent: () => import('./layout/pages/shipping-address/shipping-address.component').then(m => m.ShippingAddressComponent),
    title: 'FreshCart - Shipping Address',
    canActivate: [routesGuard]
  },
  {
    path: 'allorders',
    loadComponent: () => import('./layout/pages/orders/orders.component').then(m => m.OrdersComponent),
    title: 'FreshCart - Orders',
    canActivate: [routesGuard]
  },
  {
    path: 'product-category/:categoryId',
    loadComponent: () => import('./layout/pages/products-by-category/products-by-category.component').then(m => m.ProductsByCategoryComponent),
    title: 'FreshCart - Products by Category',
    canActivate: [routesGuard]
  },
  {
    path: 'product-brand/:brandId',
    loadComponent: () => import('./layout/pages/products-by-brands/products-by-brands.component').then(m => m.ProductsByBrandsComponent),
    title: 'FreshCart - Products by Brand',
    canActivate: [routesGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./layout/pages/login/login.component').then(m => m.LoginComponent),
    title: 'FreshCart - Login'
  },
  {
    path: 'register',
    loadComponent: () => import('./layout/pages/register/register.component').then(m => m.RegisterComponent),
    title: 'FreshCart - Register'
  },
  {
    path: '**',
    loadComponent: () => import('./layout/additions/notfound/notfound.component').then(m => m.NotfoundComponent)
  }
];

