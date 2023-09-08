import { Transformer } from '@spryker-oryx/core';
import {
  ApiProductCategoryModel,
  ProductCategory,
} from '../../../../models';

export const CategoryNodeNormalizer = 'oryx.CategoryNodeNormalizer';

export function categoryNodeNormalizer(
  data: ApiProductCategoryModel.CategoryNode
): ProductCategory {
  const { nodeId, name, order, metaDescription, parents } = data;
  const rootParent = !parents?.[0]?.parents?.length;

  return {
    id: String(nodeId),
    name,
    description: metaDescription ?? name,
    order,
    parent: !rootParent ? String(parents[0].nodeId) : undefined
  };
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryNodeNormalizer]: Transformer<ProductCategory>[];
  }
}
