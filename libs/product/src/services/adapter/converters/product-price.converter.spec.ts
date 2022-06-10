import { ApiModel } from '@spryker-oryx/product';
import { convertPrices } from './product-price.converter';

const generatePrice = (
  value: number,
  currencyCode = 'EUR',
  isNet = true,
  isDefault = true
): ApiModel.ProductPrice => {
  return {
    grossAmount: isNet ? undefined : value,
    netAmount: isNet ? value : undefined,
    currency: { code: currencyCode },
    priceTypeName: isDefault ? 'DEFAULT' : 'ORIGINAL',
  };
};

describe('when default net price is given', () => {
  it('should convert the price', () => {
    const converted = convertPrices({
      prices: [generatePrice(300, 'EUR', false)],
    });

    expect(converted.defaultPrice?.value).toEqual(300);
    expect(converted.defaultPrice?.isNet).toEqual(false);
    expect(converted.defaultPrice?.currency).toEqual('EUR');
  });
});

describe('when default gross price is given', () => {
  it('should convert the price', () => {
    const converted = convertPrices({
      prices: [generatePrice(300)],
    });

    expect(converted.defaultPrice?.value).toEqual(300);
    expect(converted.defaultPrice?.isNet).toEqual(true);
    expect(converted.defaultPrice?.currency).toEqual('EUR');
  });
});

describe('when original net price is given', () => {
  it('should convert the price', () => {
    const converted = convertPrices({
      prices: [generatePrice(300, 'EUR', true, false)],
    });

    expect(converted.originalPrice?.value).toEqual(300);
    expect(converted.originalPrice?.isNet).toEqual(true);
    expect(converted.originalPrice?.currency).toEqual('EUR');
  });
});

describe('when original gross price is given', () => {
  it('should convert the price', () => {
    const converted = convertPrices({
      prices: [generatePrice(300, 'EUR', false, false)],
    });

    expect(converted.originalPrice?.value).toEqual(300);
    expect(converted.originalPrice?.isNet).toEqual(false);
    expect(converted.originalPrice?.currency).toEqual('EUR');
  });
});
