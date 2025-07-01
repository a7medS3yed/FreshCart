import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Component, Input, input } from '@angular/core';
import { Category } from '../../../Core/Interfaces/product';
import { LoaderComponent } from '../loader/loader.component';

@Component({
  selector: 'app-category-slider',
  standalone: true,
  imports: [ CarouselModule],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss'
})
export class CategorySliderComponent {

  customOptions: OwlOptions = {
    loop: true,
    margin: 16, // space between items
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    nav: true,
    navSpeed: 600,
    navText: [
      '<i class="fas fa-chevron-left"></i>',
      '<i class="fas fa-chevron-right"></i>'
    ],
    responsive: {
      0: {
        items: 1,
        margin: 8
      },
      400: {
        items: 2,
        margin: 8
      },
      600: {
        items: 3
      },
      900: {
        items: 4
      },
      1200: {
        items: 5
      },
      1400: {
        items: 6
      }
    },
    autoplay: true,
    autoplayTimeout: 3500,
    autoplayHoverPause: true,
    smartSpeed: 500,
    animateOut: 'fadeOut'
  }

 @Input() categories: Category[] = []

}
