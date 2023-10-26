import { createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged, PriceModeChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { Product, ProductQualifier } from '../../models';
import { ProductsLoaded } from '../state';
import { ProductRelationsListAdapter } from './adapter';
import { ProductRelationsListService } from './product-relations-list.service';

export class DefaultProductRelationsListService
  implements ProductRelationsListService
{
  protected productsListQuery = createQuery({
    loader: (qualifier: ProductQualifier) => this.adapter.get(qualifier),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged, PriceModeChanged],
  });

  constructor(protected adapter = inject(ProductRelationsListAdapter)) {}

  get(qualifier: ProductQualifier): Observable<Product[] | undefined> {
    return this.productsListQuery.get(qualifier);
  }
}
