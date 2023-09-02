import { Transformer } from '@spryker-oryx/core';
import { ApiProductModel, ProductCategory } from '../../../../models';
import { DeserializeCategories } from './model';

export const CategoriesNormalizer = 'oryx.CategoriesNormalizer*';

export function categoriesNormalizer(
  data?: ApiProductModel.CategoryNodes[]
): DeserializeCategories | undefined {
  if (!data?.length) {
    return;
  }

  const categories = data.reduce<ProductCategory[]>(
    (acc, cat) =>
      cat.isActive
        ? [
            ...acc,
            {
              id: String(cat.nodeId),
              name: cat.name,
              description: cat.metaDescription,
              children: cat.children.map((child) => String(child.nodeId)),
            },
          ]
        : acc,
    []
  );

  if (!categories.length) {
    return;
  }

  return { categories };
}

declare global {
  interface InjectionTokensContractMap {
    [CategoriesNormalizer]: Transformer<DeserializeCategories>[];
  }
}
