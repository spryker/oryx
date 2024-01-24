import { ApiProductModel } from '../../../models/product.api.model';
import { DeserializeCategoryIds } from './model';

export function categoryIdNormalizer(
  data: ApiProductModel.CategoryNodes[] | undefined
): DeserializeCategoryIds | undefined {
  if (!data?.length) {
    return;
  }

  const categoryIds = data.reduce<string[]>(
    (acc, curr) => (curr.isActive ? [...acc, String(curr.nodeId)] : acc),
    []
  );

  if (!categoryIds.length) {
    return;
  }

  return { categoryIds };
}
