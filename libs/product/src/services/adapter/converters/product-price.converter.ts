export interface GlueProductPrices {
  price?: number;
  prices?: ApiModel.ProductPrice[];
}

import { ApiModel, Price, ProductPrice } from '@spryker-oryx/product';

export function convertPrices(source: GlueProductPrices): ProductPrice {
  const price: ProductPrice = {
    defaultPrice: convertPrice(
      source.prices?.find((price) => price.priceTypeName === 'DEFAULT')
    ),
    originalPrice: convertPrice(
      source.prices?.find((price) => price.priceTypeName === 'ORIGINAL')
    ),
  };
  return price;
}

function convertPrice(source?: ApiModel.ProductPrice): Price | undefined {
  const value = source?.grossAmount ?? source?.netAmount;
  if (!source || !value) {
    return;
  }
  return {
    value,
    currency: source.currency.code,
    isNet: !!source.netAmount,
  };
}
