import { injectQuery, QueryState } from '@spryker-oryx/core';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { Product, ProductQualifier } from '../models';
import { ProductService } from './product.service';
import { ProductQuery } from './state';

export class DefaultProductService implements ProductService {
  protected productQuery = injectQuery<Product, ProductQualifier>(ProductQuery);

  get(qualifier: ProductQualifier): Observable<Product | null> {
    return (
      this.productQuery
        .get(qualifier)
        // TODO: temporary fix for backward compatibility
        .pipe(map((product) => product || null))
    );
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
