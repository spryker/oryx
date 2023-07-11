import { Transformer } from '@spryker-oryx/core';
import { ApiProductModel } from '../../../../models';
import { DeserializedNode } from './model';

export const NodeNormalizer = 'oryx.NodeNormalizer*';

export function nodeNormalizer(
  data: ApiProductModel.CategoryNodes[] | undefined
): DeserializedNode | undefined {
  if (!data?.length) {
    return;
  }

  const id = data.find((node) => node.isActive)?.nodeId;

  if (!id) {
    return;
  }

  return { nodeId: String(id) };
}

declare global {
  interface InjectionTokensContractMap {
    [NodeNormalizer]: Transformer<DeserializedNode>[];
  }
}
