import {
  mockCheckout,
  mockPostCheckoutProps,
} from '@spryker-oryx/checkout/mocks';
import { checkoutAttributesSerializer } from './checkout.serializer';

describe('Checkout Serializers', () => {
  describe('Checkout Attributes Serializer', () => {
    it('should transform PostCheckoutProps into Payload', () => {
      const serialized = checkoutAttributesSerializer(mockPostCheckoutProps);

      expect(serialized).toEqual(mockCheckout);
    });
  });
});
