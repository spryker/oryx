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

export const mockShipmentMethods = [
  {
    type: 'shipment-methods',
    id: 4,
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
    id: 3,
    attributes: {
      name: 'Mock Method',
      carrierName: 'Mock Drone Carrier',
      deliveryTime: 1668528630013,
      price: 300,
      currencyIsoCode: 'EUR',
    },
  },
  {
    type: 'shipment-methods',
    id: 1,
    attributes: {
      name: 'Standard Mock',
      carrierName: 'Mock Dummy Carrier',
      deliveryTime: 1602367200000,
      price: 490,
      currencyIsoCode: 'EUR',
    },
  },
  {
    type: 'shipment-methods',
    id: 2,
    attributes: {
      name: 'Express Mock',
      carrierName: 'Mock Dummy Carrier',
      deliveryTime: null,
      price: 500,
      currencyIsoCode: 'EUR',
    },
  },
];

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
  selectedShipmentMethod: mockSelectedShipmentMethod.selectedShipmentMethod,
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

export const mockFilteredShipmentMethods = [
  {
    name: 'Mock Dummy Carrier',
    shipmentMethods: [
      { ...mockShipmentMethods[2].attributes, id: mockShipmentMethods[2].id },
      { ...mockShipmentMethods[3].attributes, id: mockShipmentMethods[3].id },
    ],
  },
  {
    name: 'Mock Drone Carrier',
    shipmentMethods: [
      { ...mockShipmentMethods[0].attributes, id: mockShipmentMethods[0].id },
      { ...mockShipmentMethods[1].attributes, id: mockShipmentMethods[1].id },
    ],
  },
];

export const mockSerializedShipmentMethods = [
  { ...mockShipmentMethods[2].attributes, id: mockShipmentMethods[2].id },
  { ...mockShipmentMethods[3].attributes, id: mockShipmentMethods[3].id },
  { ...mockShipmentMethods[0].attributes, id: mockShipmentMethods[0].id },
  { ...mockShipmentMethods[1].attributes, id: mockShipmentMethods[1].id },
];

export const mockDeliveryTimeShipmentMethod = [
  {
    name: 'Mock Dummy Carrier',
    shipmentMethods: [
      { ...mockShipmentMethods[2].attributes, id: mockShipmentMethods[2].id },
    ],
  },
];

export const mockPaymentMethods = [
  {
    paymentMethodName: 'Invoice',
    paymentProviderName: 'DummyPayment',
    priority: 1,
    requiredRequestData: [
      'paymentMethod',
      'paymentProvider',
      'dummyPaymentInvoice.dateOfBirth',
    ],
    id: '1',
  },
  {
    paymentMethodName: 'Stripe',
    paymentProviderName: 'mockProvider',
    priority: 1,
    requiredRequestData: [
      'paymentMethod',
      'paymentProvider',
      'dummyPaymentInvoice.dateOfBirth',
    ],
    id: '3',
  },
  {
    paymentMethodName: 'Paypal',
    paymentProviderName: 'mockProvider',
    priority: 2,
    requiredRequestData: [
      'paymentMethod',
      'paymentProvider',
      'dummyPaymentInvoice.dateOfBirth',
    ],
    id: '4',
  },
  {
    paymentMethodName: 'Credit Card',
    paymentProviderName: 'DummyPayment',
    priority: 2,
    requiredRequestData: [
      'paymentMethod',
      'paymentProvider',
      'dummyPaymentCreditCard.cardType',
      'dummyPaymentCreditCard.cardNumber',
      'dummyPaymentCreditCard.nameOnCard',
      'dummyPaymentCreditCard.cardExpiresMonth',
      'dummyPaymentCreditCard.cardExpiresYear',
      'dummyPaymentCreditCard.cardSecurityCode',
    ],
    id: '2',
  },
];

export const mockNormalizedPaymentMethods = mockPaymentMethods
  .map((payment) => {
    const { paymentMethodName, paymentProviderName, ...paymentData } = payment;
    return {
      ...paymentData,
      name: paymentMethodName,
      provider: paymentProviderName,
    };
  })
  .sort((a, b) =>
    a.provider.toLowerCase() < b.provider.toLowerCase()
      ? -1
      : a.provider.toLowerCase() > b.provider.toLowerCase()
      ? 1
      : 0
  );

export const mockNormalizedShipmentAttributes = {
  ...mockShipmentAttributes,
  carriers: mockFilteredShipmentMethods,
};

export const mockNormalizedCheckoutData = {
  shipments: [mockNormalizedShipmentAttributes],
  paymentMethods: mockNormalizedPaymentMethods,
};

export const mockNormalizedUpdatedCheckoutData = {
  shipments: [{ ...mockShipmentAttributes, ...mockSelectedShipmentMethod }],
  paymentMethods: mockNormalizedPaymentMethods,
  carriers: mockFilteredShipmentMethods,
};
