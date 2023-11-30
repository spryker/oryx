import { injectQuery, provideQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { LocaleChanged } from '@spryker-oryx/i18n';
import { ProductCategory, ProductCategoryQualifier } from '../../../models';
import { ProductCategoryAdapter } from '../adapter';

export const CategoryQuery = 'oryx.categoryQuery';
export const CategoryListQuery = 'oryx.categorylistQuery';

function getExcludes(
  categories: string[],
  exclude?: string | string[]
): string[] {
  if (!exclude) return [];
  let excludedIds: string[] = [];

  // Convert both string and array notations to array of strings
  const excludeIds = Array.isArray(exclude)
    ? exclude.map(String)
    : exclude.split(',').map((id) => id.trim());

  // Handle range notations like >5, <4, 4..11
  excludedIds = categories.filter((categoryId) => {
    return excludeIds.some((excludedId) => {
      if (excludedId.includes('..')) {
        const [start, end] = excludedId
          .split('..')
          .map((num) => parseInt(num, 10));
        const num = parseInt(categoryId, 10);
        return num >= start && num <= end;
      } else if (excludedId.startsWith('>')) {
        const threshold = parseInt(excludedId.slice(1), 10);
        return parseInt(categoryId, 10) > threshold;
      } else if (excludedId.startsWith('<')) {
        const threshold = parseInt(excludedId.slice(1), 10);
        return parseInt(categoryId, 10) < threshold;
      } else {
        // Regular ID match
        return categoryId === excludedId;
      }
    });
  });

  return excludedIds;
}

export function excludeCategoryTransform(
  data: ProductCategory[],
  qualifier: ProductCategoryQualifier
): ProductCategory[] {
  // Handle the parent filter
  const filteredByParent = data.filter((category) => {
    return !qualifier?.parent
      ? !category.parent
      : category.parent === qualifier?.parent;
  });

  // Handle the exclusion filter
  const excludes = getExcludes(
    filteredByParent.map((c) => c.id),
    qualifier?.exclude
  );
  return filteredByParent.filter((category) => !excludes.includes(category.id));
}

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
      postTransforms: [excludeCategoryTransform],
    })
  ),
];
