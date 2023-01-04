import { HttpErrorResponse } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { NullableGeneric } from '@spryker-oryx/utilities';
import { Observable, ReplaySubject } from 'rxjs';
import { ProductList, ProductListQualifier } from '../models';
import { ProductListAdapter } from './adapter';
import { ProductListService } from './product-list.service';

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
      next: (productList) => {
        data.value.next(productList);
        data.error.next(null);
      },
      error: (error: HttpErrorResponse) => {
        data.error.next(error);
        data.value.next(null);
      },
    });
  }
}
