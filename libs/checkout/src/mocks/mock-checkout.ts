export const mockShipmentAttributes = {
  items: ['mockitem', 'mockitem2'],
  requestedDeliveryDate: null,
  shippingAddress: {
    id: null,
    salutation: null,
    firstName: null,
    lastName: null,
    address1: null,
    address2: null,
    address3: null,
    zipCode: null,
    city: null,
    country: null,
    iso2Code: null,
    company: null,
    phone: null,
    isDefaultBilling: null,
    isDefaultShipping: null,
    idCompanyBusinessUnitAddress: null,
  },
};

export const mockSelectedShipmentMethod = {
  selectedShipmentMethod: {
    id: 2,
    name: 'mock shipment method',
    carrierName: 'mock carrier',
    price: 590,
    taxRate: '19.00',
    deliveryTime: null,
    currencyIsoCode: 'EUR',
  },
};

export const mockGetShipmentResponse = {
  included: [
    {
      type: 'shipments',
      id: 'shipment',
      attributes: {
        ...mockShipmentAttributes,
        ...mockSelectedShipmentMethod,
      },
    },
  ],
};

export const mockShipmentMethods = [
  {
    type: 'shipment-methods',
    id: '4',
    attributes: {
      name: 'Mock Express',
      carrierName: 'Mock Drone Carrier',
      deliveryTime: null,
      price: 500,
      currencyIsoCode: 'EUR',
    },
  },
  {
    type: 'shipment-methods',
    id: '3',
    attributes: {
      name: 'Mock Method',
      carrierName: 'Mock Drone Carrier',
      deliveryTime: null,
      price: 300,
      currencyIsoCode: 'EUR',
    },
  },
  {
    type: 'shipment-methods',
    id: '1',
    attributes: {
      name: 'Standard Mock',
      carrierName: 'Mock Dummy Carrier',
      deliveryTime: null,
      price: 490,
      currencyIsoCode: 'EUR',
    },
  },
  {
    type: 'shipment-methods',
    id: '2',
    attributes: {
      name: 'Express Mock',
      carrierName: 'Mock Dummy Carrier',
      deliveryTime: null,
      price: 500,
      currencyIsoCode: 'EUR',
    },
  },
];

export const mockFilteredShipmentMethods = {
  'Mock Dummy Carrier': [
    { ...mockShipmentMethods[2].attributes, id: mockShipmentMethods[2].id },
    { ...mockShipmentMethods[3].attributes, id: mockShipmentMethods[3].id },
  ],
  'Mock Drone Carrier': [
    { ...mockShipmentMethods[0].attributes, id: mockShipmentMethods[0].id },
    { ...mockShipmentMethods[1].attributes, id: mockShipmentMethods[1].id },
  ],
};

export const mockNormalizedCheckoutData = {
  shipments: [mockShipmentAttributes],
  shipmentMethods: mockFilteredShipmentMethods,
};

export const mockNormalizedUpdatedCheckoutData = {
  shipments: [{ ...mockShipmentAttributes, ...mockSelectedShipmentMethod }],
  shipmentMethods: mockFilteredShipmentMethods,
};
