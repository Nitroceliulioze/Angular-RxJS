import { ProductCategoryService } from './../product-categories/product-category.service';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ProductCategory } from '../product-categories/product-category';

import { Product } from './product';
import { ProductService } from './product.service';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subject,
  catchError,
  combineLatest,
  filter,
  map,
} from 'rxjs';

@Component({
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductListComponent {
  pageTitle = 'Product List';
  errorMessage = '';
  private categorSelectedSubject = new BehaviorSubject<number>(0);
  cateorySelectedAction$ = this.categorSelectedSubject.asObservable();

  categories$ = this.productCategoryService.productCategories$.pipe(
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  products$ = combineLatest([
    this.productService.productsWithCategory$,
    this.cateorySelectedAction$,
  ]).pipe(
    map(([products, selectedcategoryId]) =>
      products.filter((product) =>
        selectedcategoryId ? product.categoryId === selectedcategoryId : true
      )
    ),
    catchError((err) => {
      this.errorMessage = err;
      return EMPTY;
    })
  );

  constructor(
    private productService: ProductService,
    private productCategoryService: ProductCategoryService
  ) {}

  onAdd(): void {
    console.log('Not yet implemented');
  }

  onSelected(categoryId: string): void {
    this.categorSelectedSubject.next(+categoryId)
  }
}
