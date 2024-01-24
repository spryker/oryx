import { ApiProductModel } from '../../../models/product.api.model';
import { priceNormalizer } from './price.normalizer';

const generatePrice = (
  value: number,
  currencyCode = 'EUR',
  isNet = true,
  isDefault = true
): ApiProductModel.Prices => {
  return {
    prices: [
      {
        grossAmount: isNet ? undefined : value,
        netAmount: isNet ? value : undefined,
        currency: { code: currencyCode },
        priceTypeName: isDefault ? 'DEFAULT' : 'ORIGINAL',
      },
    ],
  };
};

describe('Price Normalizer', () => {
  it('should convert the price when default net price is given', () => {
    const normalized = priceNormalizer(generatePrice(300, 'EUR', false));
    expect(normalized.defaultPrice?.value).toEqual(300);
    expect(normalized.defaultPrice?.isNet).toEqual(false);
    expect(normalized.defaultPrice?.currency).toEqual('EUR');
  });

  it('should convert the price when default gross price is given', () => {
    const normalized = priceNormalizer(generatePrice(300));
    expect(normalized.defaultPrice?.value).toEqual(300);
    expect(normalized.defaultPrice?.isNet).toEqual(true);
    expect(normalized.defaultPrice?.currency).toEqual('EUR');
  });

  it('should convert the price when original net price is given', () => {
    const normalized = priceNormalizer(generatePrice(300, 'EUR', true, false));
    expect(normalized.originalPrice?.value).toEqual(300);
    expect(normalized.originalPrice?.isNet).toEqual(true);
    expect(normalized.originalPrice?.currency).toEqual('EUR');
  });

  it('should convert the price when original gross price is given', () => {
    const normalized = priceNormalizer(generatePrice(300, 'EUR', false, false));
    expect(normalized.originalPrice?.value).toEqual(300);
    expect(normalized.originalPrice?.isNet).toEqual(false);
    expect(normalized.originalPrice?.currency).toEqual('EUR');
  });
});
