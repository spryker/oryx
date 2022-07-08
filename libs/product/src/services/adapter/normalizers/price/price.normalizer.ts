import { ApiModel, Price, ProductPrice } from '../../../../models';
import { GlueProductPrices } from './model';

export function priceNormalizer(data: GlueProductPrices): ProductPrice {
  const normalize = (data?: ApiModel.ProductPrice): Price | undefined => {
    const value = data?.grossAmount ?? data?.netAmount;

    if (!data || !value) {
      return;
    }

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
