import { createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { AlternativeProductsListService } from './alternative-products-list.service';
import { ProductsLoaded } from './state/events';
import { AlternativeProductsListAdapter } from './adapter/alternative-products-list.adapter';
import { Product } from '../models/product.model';
import { ProductQualifier } from '../models/product-qualifier';

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
