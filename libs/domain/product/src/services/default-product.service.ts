import { injectQuery, QueryState } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../models';
import { ProductService } from './product.service';
import { ProductQuery } from './state';

export class DefaultProductService implements ProductService {
  protected productQuery = injectQuery<Product, ProductQualifier>(ProductQuery);

  get(qualifier: ProductQualifier): Observable<Product | undefined> {
    return this.productQuery.get(qualifier);
  }

  getState(qualifier: ProductQualifier): Observable<QueryState<Product>> {
    return this.productQuery.getState(qualifier);
  }
}
