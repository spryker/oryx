import { Transformer } from '@spryker-oryx/core';
import { ApiProductCategoryModel, ProductCategory } from '../../../../models';

export const CategoryNodeNormalizer = 'oryx.CategoryNodeNormalizer';

export function categoryNodeNormalizer(
  data: ApiProductCategoryModel.CategoryNode
): ProductCategory {
  const { nodeId, name, order, metaDescription, parents } = data;
  //parent category without other parents is considered root category
  //and should be ignored
  const rootParent = !parents?.[0]?.parents?.length;

  return {
    id: String(nodeId),
    name,
    description: metaDescription ?? name,
    order,
    parent: !rootParent ? String(parents[0].nodeId) : undefined,
  };
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryNodeNormalizer]: Transformer<ProductCategory>[];
  }
}
