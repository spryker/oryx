import { Transformer } from '@spryker-oryx/core';

export const ProductNormalizer = 'FES.ProductNormalizer';

declare global {
  interface InjectionTokensContractMap {
    [ProductNormalizer]: Transformer[];
  }
}
