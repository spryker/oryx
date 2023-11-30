import { injectQuery, provideQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { ProductCategory, ProductCategoryQualifier } from '../../../models';
import { ProductCategoryAdapter } from '../adapter';

export const CategoryQuery = 'oryx.categoryQuery';
export const CategoryListQuery = 'oryx.categorylistQuery';

export const categoryQueries = [
  provideQuery(CategoryQuery, (adapter = inject(ProductCategoryAdapter)) => ({
    loader: (qualifier: ProductCategoryQualifier) => adapter.get(qualifier),
  })),
  provideQuery(
    CategoryListQuery,
    (
      adapter = inject(ProductCategoryAdapter),
      categoryQuery = injectQuery<ProductCategory, ProductCategoryQualifier>(
        CategoryQuery
      )
    ) => ({
      loader: () => adapter.getTree(),
      onLoad: [
        ({ data: categories }) => {
          (categories as any[])?.forEach((category: any) => {
            categoryQuery.set({
              data: category,
              qualifier: { id: category.id },
            });
          });
        },
      ],
      refreshOn: [LocaleChanged],
    })
  ),
];
