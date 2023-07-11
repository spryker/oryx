import { Transformer } from '@spryker-oryx/core';
import { ApiProductModel } from '../../../../models';
import { DeserializedNode } from './model';

export const CategoryIdNormalizer = 'oryx.CategoryIdNormalizer*';

export function categoryIdNormalizer(
  data: ApiProductModel.CategoryNodes[] | undefined
): DeserializedNode | undefined {
  if (!data?.length) {
    return;
  }

  const id = data.find((node) => node.isActive)?.nodeId;

  if (!id) {
    return;
  }

  return { categoryId: String(id) };
}

declare global {
  interface InjectionTokensContractMap {
    [CategoryIdNormalizer]: Transformer<DeserializedNode>[];
  }
}
