import { provideQuery, Query, QueryOptions } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { CurrencyChanged, PriceModeChanged } from '@spryker-oryx/site';
import { Product, ProductQualifier } from '../../models';
import { ProductAdapter } from '../adapter';
import { ProductLoaded } from './events';

export const ProductQuery = 'oryx.productQuery';

export type ProductQuery = Query<Product, ProductQualifier>;

export function productQueryFactory(
  adapter = inject(ProductAdapter)
): QueryOptions<Product, ProductQualifier> {
  return {
    cacheKey: (q: ProductQualifier) => q?.sku ?? '',
    loader: (q: ProductQualifier) => adapter.get(q),
    onLoad: [ProductLoaded],
    refreshOn: [LocaleChanged, CurrencyChanged, PriceModeChanged],
  };
}

export const productQueries = [provideQuery(ProductQuery, productQueryFactory)];
