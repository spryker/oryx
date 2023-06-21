import { createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged } from '@spryker-oryx/site';
import { Observable } from 'rxjs';
import { ProductQualifier } from '../models/product-qualifier';
import { Product } from '../models/product.model';
import { ProductRelationsListAdapter } from './adapter/product-relations-list.adapter';
import { ProductRelationsListService } from './product-relations-list.service';
import { ProductsLoaded } from './state/events';

export class DefaultProductRelationsListService
  implements ProductRelationsListService
{
  protected productsListQuery = createQuery({
    loader: (qualifier: ProductQualifier) => this.adapter.get(qualifier),
    onLoad: [ProductsLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged],
  });

  constructor(protected adapter = inject(ProductRelationsListAdapter)) {}

  get(qualifier: ProductQualifier): Observable<Product[] | undefined> {
    return this.productsListQuery.get(qualifier);
  }
}
