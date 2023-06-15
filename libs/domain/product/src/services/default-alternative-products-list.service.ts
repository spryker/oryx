import { createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { AlternativeProductsListService } from './alternative-products-list.service';
import { ProductsLoaded } from './state/events';
import { AlternativeProductsListAdapter } from './adapter/alternative-products-list.adapter';
import { Product } from '../models/product.model';

export class DefaultAlternativeProductsListService
  implements AlternativeProductsListService
{
  protected productsListQuery = createQuery({
    loader: ({ sku }: { sku: string }) => this.adapter.get(sku),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

  constructor(protected adapter = inject(AlternativeProductsListAdapter)) {}

  get(sku: string): Observable<Product[] | undefined> {
    return this.productsListQuery.get({ sku });
  }
}
