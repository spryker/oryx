import { checkoutAttributesSerializer } from './checkout.serializer';

const mockUpdateCheckoutDataProps = {
  user: { anonymousUserId: 'mockid' },
  idCart: 'mockcart',
  attributes: {
    shipments: [
      {
        items: ['mock-product', 'mock-product2'],
        requestedDeliveryDate: null,
        idShipmentMethod: 1,
        shippingAddress: {
          address1: null,
          address2: null,
          address3: null,
          city: null,
          company: null,
          country: null,
          firstName: null,
          id: null,
          idCompanyBusinessUnitAddress: null,
          isDefaultBilling: null,
          isDefaultShipping: null,
          iso2Code: null,
          lastName: null,
          phone: null,
          salutation: null,
          zipCode: null,
        },
      },
    ],
  },
};

describe('Checkout Serializers', () => {
  describe('Checkout Attributes Serializer', () => {
    it('should transform UpdateCheckoutDataProps into Payload', () => {
      const mockResult = {
        attributes: {
          idCart: mockUpdateCheckoutDataProps.idCart,
          ...mockUpdateCheckoutDataProps.attributes,
        },
        type: 'checkout-data',
      };

      const serialized = checkoutAttributesSerializer(
        mockUpdateCheckoutDataProps
      );
      expect(serialized).toEqual(mockResult);
    });
  });
});
