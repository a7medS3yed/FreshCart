import { Pipe, PipeTransform } from '@angular/core';
import { Product } from '../Interfaces/product';

@Pipe({
  name: 'search',
  standalone: true
})
export class SearchPipe implements PipeTransform {

  transform(products:Product[], value: string): any {

   if (!value) return products;
   return products.filter(p => p.slug.toLowerCase().includes(value.toLowerCase()));
    
  }

}
