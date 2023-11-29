import { provideQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { ProductCategoryQualifier } from '../../../models';
import { ProductCategoryAdapter } from '../adapter';

export const CategoryQuery = 'oryx.categoryQuery';

export const categoryQuery = provideQuery(
  CategoryQuery,
  (adapter = inject(ProductCategoryAdapter)) => ({
    id: CategoryQuery,
    loader: (qualifier: ProductCategoryQualifier) => adapter.get(qualifier),
  })
);
