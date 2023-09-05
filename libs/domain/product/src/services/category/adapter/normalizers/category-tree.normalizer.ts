import { Transformer } from '@spryker-oryx/core';
import {
  ApiProductCategoryModel,
  ProductCategoryNode,
} from '../../../../models';

export const CategoryTreeNormalizer = 'oryx.CategoryTreeNormalizer';

export function categoryTreeNormalizer(
  data: ApiProductCategoryModel.CategoryNodesStorage[]
): ProductCategoryNode[] {
  const mapCategory = (
    category: ApiProductCategoryModel.CategoryTreeNode
  ): ProductCategoryNode => {
    const { nodeId, name, order, children } = category;
    return {
      id: String(nodeId),
      name,
      order,
      children: children.map(mapCategory),
    };
  };

  return (data[0]?.categoryNodesStorage ?? []).map((category) =>
    mapCategory(category)
  );
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryTreeNormalizer]: Transformer<ProductCategoryNode[]>[];
  }
}
