/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createQuery, HttpErrorResponse, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { NullableGeneric } from '@spryker-oryx/utilities';
import { distinctUntilChanged, map, Observable, ReplaySubject } from 'rxjs';
import { Product, ProductQualifier } from '../models';
import { ProductAdapter } from './adapter/product.adapter';
import { ProductService } from './product.service';

export interface ProductData {
  value: ReplaySubject<NullableGeneric<Product>>;
  error: ReplaySubject<NullableGeneric<HttpErrorResponse>>;
}

export class DefaultProductService implements ProductService {
  protected products = new Map<string, ProductData>();

  protected productQuery = createQuery({
    loader: (q: ProductQualifier) => this.adapter.get(q),
  });

  constructor(protected adapter = inject(ProductAdapter)) {}

  get(qualifier: ProductQualifier): Observable<Product | undefined> {
    return this.productQuery.get(qualifier);
  }

  getState(qualifier: ProductQualifier): Observable<QueryState<Product>> {
    return this.productQuery.getState(qualifier);
  }

  getError(qualifier: ProductQualifier): Observable<Error | false> {
    return this.productQuery.getState(qualifier).pipe(
      map((state) => state.error),
      distinctUntilChanged()
    );
  }
}
