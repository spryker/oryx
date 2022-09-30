import { HttpErrorResponse } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/injector';
import {
  ProductList,
  ProductListAdapter,
  ProductListService,
} from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/typescript-utils';
import { Observable, ReplaySubject } from 'rxjs';
import { ProductListQualifier } from '../models/product-list-qualifier';

export interface ProductListData {
  value: ReplaySubject<NullableGeneric<ProductList>>;
  error: ReplaySubject<NullableGeneric<HttpErrorResponse>>;
}

export class DefaultProductListService implements ProductListService {
  protected products = new Map<string, ProductListData>();
  protected readonly productListSearchParams: Array<
    keyof ProductListQualifier
  > = [
    'q',
    'page',
    'maxPrice',
    'minPrice',
    'minRating',
    'ipp',
    'brand',
    'label',
    'weight',
    'color',
    'category',
    'sort',
  ];

  constructor(protected adapter = inject(ProductListAdapter)) {}

  get(
    qualifier: ProductListQualifier
  ): Observable<NullableGeneric<ProductList>> {
    return this.getData(qualifier).value;
  }

  getSearchParams(qualifier: ProductListQualifier): Record<string, string> {
    return this.productListSearchParams.reduce(
      (
        params: Record<string | number, string>,
        key: keyof ProductListQualifier
      ) => {
        if (qualifier[key]) {
          params[key] = qualifier[key] as string;
        }

        return params;
      },
      {}
    );
  }

  getError(
    qualifier: ProductListQualifier
  ): Observable<NullableGeneric<HttpErrorResponse>> {
    return this.getData(qualifier).error;
  }

  protected getData(qualifier: ProductListQualifier): ProductListData {
    const key = this.adapter.getKey(qualifier);

    this.initProducts(qualifier, key);
    return this.products.get(key) as ProductListData;
  }

  protected initProducts(qualifier: ProductListQualifier, key: string): void {
    if (this.products.has(key)) {
      return;
    }

    this.products.set(key, {
      value: new ReplaySubject<NullableGeneric<ProductList>>(1),
      error: new ReplaySubject<NullableGeneric<HttpErrorResponse>>(1),
    });

    const data = this.products.get(key) as ProductListData;
    this.adapter.get(qualifier).subscribe({
      next: (product) => {
        data.value.next(product);
        data.error.next(null);
      },
      error: (error: HttpErrorResponse) => {
        data.error.next(error);
        data.value.next(null);
      },
    });
  }
}
