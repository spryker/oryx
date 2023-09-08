import { Transformer } from '@spryker-oryx/core';
import {
  ApiProductCategoryModel,
  ProductCategory,
} from '../../../../models';

export const CategoryTreeNormalizer = 'oryx.CategoryTreeNormalizer';

function mapCategoryNode(
  category: ApiProductCategoryModel.CategoryNode,
  parent?: string
): ProductCategory {
  const { nodeId, name, order, metaDescription } = category;
  return {
    id: String(nodeId),
    name,
    description: metaDescription ?? name,
    order,
    parent
  };
};

function flattenCategoryNodes(
  categories: ApiProductCategoryModel.CategoryNode[]
): ProductCategory[] {
  const result: ProductCategory[] = [];

  const collect = (
    cats: ApiProductCategoryModel.CategoryNode[],
    parent?: string
  ): void => {
    if (cats.length) {
      cats.forEach((child_cat) => {
        result.push(mapCategoryNode(child_cat, parent));
        collect(child_cat.children, String(child_cat.nodeId));
      });
    }
  };

  collect(categories);

  return result;
}

export function categoryTreeNormalizer(
  data: ApiProductCategoryModel.CategoryNodesStorage[]
): ProductCategory[] {
  return flattenCategoryNodes(data[0]?.categoryNodesStorage ?? []);
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryTreeNormalizer]: Transformer<ProductCategory[]>[];
  }
}
