import { CheckoutResponse } from '@spryker-oryx/checkout';
import { checkoutResponseAttributesNormalizer } from './checkout-response.normalizer';

describe('Checkout Response Normalizer', () => {
  describe('Checkout Response Attributes Normalizer', () => {
    it('should pass through the data', () => {
      const mockResult = {
        orderReference: 'test',
      } as CheckoutResponse;

      const normalized = checkoutResponseAttributesNormalizer(mockResult);
      expect(normalized).toEqual(mockResult);
    });
  });
});
