import { createQuery, QueryState } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { CurrencyChanged, LocaleChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { ProductList, ProductListQualifier } from '../models';
import { ProductListAdapter } from './adapter';
import { ProductListService } from './product-list.service';
import { ProductsLoaded } from './state';

export class DefaultProductListService implements ProductListService {
  protected productListQuery = createQuery({
    loader: (q: ProductListQualifier) => this.adapter.get(q),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

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

  get(qualifier: ProductListQualifier): Observable<ProductList | undefined> {
    return this.productListQuery.get(qualifier);
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

  getState(
    qualifier: ProductListQualifier
  ): Observable<QueryState<ProductList>> {
    return this.productListQuery.getState(qualifier);
  }
}
