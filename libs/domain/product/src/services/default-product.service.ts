/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { HttpErrorResponse } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { NullableGeneric } from '@spryker-oryx/utilities';
import { distinctUntilChanged, Observable, ReplaySubject } from 'rxjs';
import { Product, ProductQualifier } from '../models';
import { ProductAdapter } from './adapter/product.adapter';
import { ProductService } from './product.service';

export interface ProductData {
  value: ReplaySubject<NullableGeneric<Product>>;
  error: ReplaySubject<NullableGeneric<HttpErrorResponse>>;
}

export class DefaultProductService implements ProductService {
  protected products = new Map<string, ProductData>();

  constructor(protected adapter = inject(ProductAdapter)) {}

  get(qualifier: ProductQualifier): Observable<NullableGeneric<Product>> {
    return this.getProductData(qualifier).value;
  }

  getError(
    qualifier: ProductQualifier
  ): Observable<NullableGeneric<HttpErrorResponse>> {
    return this.getProductData(qualifier)!.error.pipe(distinctUntilChanged());
  }

  protected getProductData(qualifier: ProductQualifier): ProductData {
    const key = this.adapter.getKey(qualifier);

    if (!this.products.has(key)) {
      this.products.set(key, {
        value: new ReplaySubject<NullableGeneric<Product>>(1),
        error: new ReplaySubject<NullableGeneric<HttpErrorResponse>>(1),
      });
      this.reload(qualifier, key);
    }

    return this.products.get(key)!;
  }

  protected reload(qualifier: ProductQualifier, key?: string): void {
    if (key === undefined) {
      key = this.adapter.getKey(qualifier);
    }

    const productData = this.products.get(key!)!;

    this.adapter.get(qualifier).subscribe({
      next: (product) => {
        productData.value.next(product);
        productData.error.next(null);
      },
      error: (error: HttpErrorResponse) => {
        productData.error.next(error);
        productData.value.next(null);
      },
    });
  }
}
