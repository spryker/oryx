import { checkoutDataAttributesSerializer } from './checkout-data.serializer';
import { checkoutAttributesSerializer } from './checkout.serializer';

const mockUpdateCheckoutDataProps = {
  user: { anonymousUserId: 'mockid' },
  cartId: 'mockcart',
  shipments: [],
};

describe('Checkout Data Serializers', () => {
  describe('Checkout Data Attributes Serializer', () => {
    it('should reuse checkout AttributesSerializer', () => {
      const mockResult = {
        ...checkoutAttributesSerializer(mockUpdateCheckoutDataProps),
        type: 'checkout-data',
      };

      const serialized = checkoutDataAttributesSerializer(
        mockUpdateCheckoutDataProps
      );
      expect(serialized).toEqual(mockResult);
    });
  });
});
