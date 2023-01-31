import { mockOrderData } from '@spryker-oryx/order/mocks';
import { orderAttributesNormalizer } from './order.normalizer';

describe('Order Normalizers', () => {
  describe('Order Attributes Normalizer', () => {
    it('should transform DeserializedOrder into OrderData', () => {
      const normalized = orderAttributesNormalizer(mockOrderData);
      expect(normalized).toEqual(mockOrderData);
    });
  });
});
