import { Transformer } from '@spryker-oryx/core';
import {
  ApiProductModel,
  ProductPrice,
  ProductPrices,
} from '../../../../models';

export const PriceNormalizer = 'oryx.PriceNormalizer*';

export function priceNormalizer(data: ApiProductModel.Prices): ProductPrices {
  const normalize = (
    data?: ApiProductModel.Price
  ): ProductPrice | undefined => {
    const value = data?.grossAmount ?? data?.netAmount;

    if (!data || !value) return;

    return {
      value,
      currency: data.currency.code,
      isNet: !!data.netAmount,
    };
  };

  return {
    defaultPrice: normalize(
      data?.prices?.find((price) => price.priceTypeName === 'DEFAULT')
    ),
    originalPrice: normalize(
      data?.prices?.find((price) => price.priceTypeName === 'ORIGINAL')
    ),
  };
}

declare global {
  interface InjectionTokensContractMap {
    [PriceNormalizer]: Transformer<ProductPrices>[];
  }
}
