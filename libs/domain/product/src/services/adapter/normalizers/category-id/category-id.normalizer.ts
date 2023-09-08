import { Transformer } from '@spryker-oryx/core';
import { ApiProductModel } from '../../../../models';
import { DeserializeCategoryIds } from './model';

export const CategoryIdNormalizer = 'oryx.CategoryIdNormalizer*';

export function categoryIdNormalizer(
  data: ApiProductModel.CategoryNodes[] | undefined
): DeserializeCategoryIds | undefined {
  if (!data?.length) {
    return;
  }

  const categoryIds = data.reduce(
    (acc, curr) => [...acc, String(curr.nodeId)],
    [] as string[]
  );

  if (!categoryIds.length) {
    return;
  }

  return { categoryIds };
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryIdNormalizer]: Transformer<DeserializeCategoryIds>[];
  }
}
