import { provideQuery, Query } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleService } from '@spryker-oryx/site';
import { skip } from 'rxjs';
import { Product, ProductQualifier } from '../../models';
import { ProductAdapter } from '../adapter';

export const ProductQuery = 'oryx.productQuery';

export type ProductQuery = Query<Product, ProductQualifier>;

export const productQueries = [
  provideQuery(
    ProductQuery,
    (adapter = inject(ProductAdapter), locale = inject(LocaleService)) => ({
      loader: (q: ProductQualifier) => adapter.get(q),
      refreshOn: [locale.get().pipe(skip(1))],
    })
  ),
];
