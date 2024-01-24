import { ProductCategory } from '@spryker-oryx/product';
import { ApiProductCategoryModel } from '../../../models';

export function mapCategoryNode(
  category: ApiProductCategoryModel.CategoryNode,
  parent?: string
): ProductCategory {
  const { nodeId, name, order, metaDescription } = category;
  return {
    id: String(nodeId),
    name,
    description: metaDescription ?? name,
    order,
    parent,
  };
}

export function flattenCategoryNodes(
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
