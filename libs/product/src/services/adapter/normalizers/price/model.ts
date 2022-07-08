import { ApiModel } from '../../../../models';

export const PriceNormalizer = 'FES.PriceNormalizer';

export interface GlueProductPrices {
  price?: number;
  prices?: ApiModel.ProductPrice[];
}

declare global {
  interface InjectionTokensContractMap {
    [PriceNormalizer]: Transformer;
  }
}
