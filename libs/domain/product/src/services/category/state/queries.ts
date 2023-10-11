import { provideQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { CategoryQualifier } from '../../../models';
import { ProductCategoryAdapter } from '../adapter';

export const CategoryQuery = 'oryx.categoryQuery';

export const categoryQuery = provideQuery(
  CategoryQuery,
  (adapter = inject(ProductCategoryAdapter)) => ({
    id: CategoryQuery,
    loader: (q: CategoryQualifier) => adapter.get(q.id),
  })
);
