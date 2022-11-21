import {
  mockFilteredShipmentMethods,
  mockSerializedShipmentMethods,
} from '@spryker-oryx/checkout/mocks';
import { defaultSelectedShipmentMethod } from '../../../../models';
import { checkoutAttributesSerializer } from './checkout.serializer';

const mockShipment = {
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
};
const mockUpdateCheckoutDataProps = {
  user: { anonymousUserId: 'mockid' },
  idCart: 'mockcart',
  attributes: {
    shipments: [mockShipment],
  },
};

const mockCarrierMethodCheckoutDataProps = {
  user: { anonymousUserId: 'mockid' },
  idCart: 'mockcart',
  attributes: {
    shipments: [mockShipment],
    carriers: mockFilteredShipmentMethods,
  },
};

describe('Checkout Serializers', () => {
  describe('Checkout Attributes Serializer', () => {
    it('should transform UpdateCheckoutDataProps into Payload', () => {
      const mockResult = {
        attributes: {
          idCart: mockUpdateCheckoutDataProps.idCart,
          ...mockUpdateCheckoutDataProps.attributes,
          shipmentMethods: [],
          shipments: [
            {
              ...mockShipment,
              selectedShipmentMethod: defaultSelectedShipmentMethod,
            },
          ],
        },
        type: 'checkout-data',
      };

      const serialized = checkoutAttributesSerializer(
        mockUpdateCheckoutDataProps
      );
      expect(serialized).toEqual(mockResult);
    });
    describe('when carriers are included', () => {
      it('should transform carriers to shipmentMethods', () => {
        const mockResult = {
          attributes: {
            idCart: mockUpdateCheckoutDataProps.idCart,
            ...mockUpdateCheckoutDataProps.attributes,
            shipmentMethods: mockSerializedShipmentMethods,
            shipments: [
              {
                ...mockShipment,
                selectedShipmentMethod: defaultSelectedShipmentMethod,
              },
            ],
          },
          type: 'checkout-data',
        };

        const serialized = checkoutAttributesSerializer(
          mockCarrierMethodCheckoutDataProps
        );
        expect(serialized).toEqual(mockResult);
      });
    });
  });
});
