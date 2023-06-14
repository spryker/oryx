import { createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import {
  AlternativeProductsListAdapter,
  Product,
  ProductQualifier,
  ProductsLoaded,
} from '@spryker-oryx/product';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { AlternativeProductsListService } from './alternative-products-list.service';

export class DefaultAlternativeProductsListService
  implements AlternativeProductsListService
{
  protected productsListQuery = createQuery({
    loader: (qualifier: ProductQualifier) => this.adapter.get(qualifier),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

  constructor(protected adapter = inject(AlternativeProductsListAdapter)) {}

  get(qualifier: ProductQualifier): Observable<Product[] | undefined> {
    return this.productsListQuery.get(qualifier);
  }
}
