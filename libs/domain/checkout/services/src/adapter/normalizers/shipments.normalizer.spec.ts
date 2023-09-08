import { Shipment } from '../../../../models';
import { DeserializedCheckout } from '../checkout/model';
import { shipmentsNormalizer } from './shipments.normalizer';

const mockBaseShipment = {
  items: ['mock-product', 'mock-product2'],
  requestedDeliveryDate: null,
  selectedShipmentMethod: {
    id: '1',
    name: 'mock shipment method',
    carrierName: 'mock carrier',
    price: 123,
    taxRate: '19.00',
    currencyIsoCode: 'EUR',
    deliveryTime: null,
  },
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

const mockShipmentMethods = [
  {
    id: '2',
    name: 'mock shipment method 2',
    carrierName: 'mock carrier',
    price: 123,
    currencyIsoCode: 'EUR',
    deliveryTime: null,
  },
  {
    id: '1',
    name: 'mock shipment method',
    carrierName: 'mock carrier',
    price: 456,
    currencyIsoCode: 'EUR',
    deliveryTime: null,
  },
  {
    id: '3',
    name: 'mock shipment method3',
    carrierName: 'mock carrier 2',
    price: 100,
    currencyIsoCode: 'EUR',
    deliveryTime: null,
  },
];

const mockCheckoutData: DeserializedCheckout = {
  addresses: [],
  paymentProviders: [],
  shipmentMethods: [],
  selectedShipmentMethods: [],
  selectedPaymentMethods: [],
  shipments: [{ ...mockBaseShipment, shipmentMethods: mockShipmentMethods }],
};

const mockNormalizedShipment: Shipment[] = [
  {
    ...mockBaseShipment,
    carriers: [
      {
        name: 'mock carrier',
        shipmentMethods: [mockShipmentMethods[0], mockShipmentMethods[1]],
      },
      { name: 'mock carrier 2', shipmentMethods: [mockShipmentMethods[2]] },
    ],
  },
];

describe('shipmentsNormalizer', () => {
  describe('when no data is provided', () => {
    it('should return an empty array', () => {
      expect(shipmentsNormalizer()).toEqual([]);
    });
  });

  describe('when valid data is provided', () => {
    it('should transform ApiCheckoutModel.ShipmentInclude into CheckoutData', () => {
      const normalized = shipmentsNormalizer(mockCheckoutData);
      expect(normalized).toEqual(mockNormalizedShipment);
    });
  });
});
