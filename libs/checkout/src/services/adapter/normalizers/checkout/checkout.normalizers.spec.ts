import { of, take } from 'rxjs';
import { ShipmentsNormalizers } from '../shipments';
import {
  checkoutAttributesNormalizer,
  checkoutShipmentsNormalizer,
} from './checkout.normalizers';
import { DeserializedCheckout } from './model';

const mockDeserializedCheckout = {
  addresses: [],
  id: null,
  paymentProviders: [],
  selectedPaymentMethods: [],
  selectedShipmentMethods: [],
  shipmentMethods: [],
  shipments: [
    {
      id: 'mockid',
      items: ['mock-product', 'mock-product2'],
      requestedDeliveryDate: null,
      selectedShipmentMethod: {
        id: 1,
        name: 'mock shipment method',
        carrierName: 'mock carrier',
        price: 123,
        taxRate: '19.00',
      },
      shipmentMethods: [
        {
          id: 2,
          name: 'mock shipment method 2',
          carrierName: 'mock carrier',
          price: 123,
        },
        {
          id: 1,
          name: 'mock shipment method',
          carrierName: 'mock carrier',
          price: 456,
        },
        {
          id: 3,
          name: 'mock shipment method3',
          carrierName: 'mock carrier 2',
          price: 100,
        },
      ],
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
} as unknown as DeserializedCheckout;

const mockTransformer = {
  transform: vi.fn(),
  do: vi.fn(),
};

describe('Checkout Normalizers', () => {
  describe('Checkout Attributes Normalizer', () => {
    it('should transform DeserializedCheckout into CheckoutData', () => {
      const mockResult = {
        addresses: [],
        paymentProviders: [],
        selectedShipmentMethods: [],
      };

      const normalized = checkoutAttributesNormalizer(mockDeserializedCheckout);
      expect(normalized).toEqual(mockResult);
    });
  });

  describe('Checkout Shipments Normalizers', () => {
    it('should call shipments transformer', () => {
      mockTransformer.transform.mockReturnValue(
        of(mockDeserializedCheckout.shipments)
      );
      checkoutShipmentsNormalizer(mockDeserializedCheckout, mockTransformer)
        .pipe(take(1))
        .subscribe((normalized) => {
          expect(normalized).toEqual({
            shipments: mockDeserializedCheckout.shipments,
          });
          expect(mockTransformer.transform).toHaveBeenLastCalledWith(
            mockDeserializedCheckout,
            ShipmentsNormalizers
          );
        });
    });
  });
});
