import { ProductCategory } from '@spryker-oryx/product';
import { ApiProductCategoryModel } from '../../../models';

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
