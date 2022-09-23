import { PriceMode } from '../models';

export const mockDiscounts = [
  {
    displayName: '€5 every tuesday and wednesday for buying 5 items',
    amount: 12075,
  },
];

export const mockCartTotals = {
  expenseTotal: 1000,
  discountTotal: 12075,
  taxTotal: 6386,
  subtotal: 161942,
  grandTotal: 149867,
  priceToPay: 150867,
};

export const mockCartResponse = {
  type: 'carts',
  id: 'cart',
  attributes: {
    name: 'Shopping cart',
    isDefault: false,
    totals: mockCartTotals,
    discounts: mockDiscounts,
    priceMode: PriceMode.NetMode,
  },
  relationships: {
    items: {
      data: [
        {
          type: 'items',
          id: 'entry',
        },
      ],
    },
  },
};

export const mockCartDefaultResponse = {
  type: 'carts',
  id: 'default',
  attributes: {
    name: 'Shopping cart',
    isDefault: true,
    totals: mockCartTotals,
    discounts: mockDiscounts,
    priceMode: PriceMode.GrossMode,
  },
  relationships: {
    items: {
      data: [
        {
          type: 'items',
          id: 'entry',
        },
      ],
    },
  },
};

export const mockEntryInclude = {
  type: 'items',
  id: 'entry',
  attributes: {
    sku: 'sku',
    groupKey: 'groupKey',
    abstractSku: 'abstractSku',
    quantity: 1,
  },
};

export const mockNormalizedEntry = {
  id: mockEntryInclude.id,
  ...mockEntryInclude.attributes,
};

export const mockNormalizedCart = {
  id: mockCartResponse.id,
  ...mockCartResponse.attributes,
  products: [mockNormalizedEntry],
};

export const mockNormalizedDefaultCart = {
  id: mockCartDefaultResponse.id,
  ...mockCartDefaultResponse.attributes,
  products: [mockNormalizedEntry],
};

export const mockNormalizedCartWithoutProducts = {
  id: mockCartResponse.id,
  ...mockCartResponse.attributes,
};

export const mockNormalizedDefaultCartWithoutProducts = {
  id: mockCartDefaultResponse.id,
  ...mockCartDefaultResponse.attributes,
};

export const mockNormalizedCartWithSingleProducts = {
  ...mockCartDefaultResponse.attributes,
  id: 'single',
};

export const mockNormalizedCartWithMultipleProducts = {
  ...mockCartDefaultResponse.attributes,
  id: 'multiple',
};

export const mockNormalizedCartEntry = {
  id: mockEntryInclude.id,
  ...mockEntryInclude.attributes,
};

export const mockGetCartsResponse = {
  data: [mockCartResponse, mockCartDefaultResponse],
  included: [mockEntryInclude],
};

export const mockGetCartResponse = {
  data: mockCartResponse,
  included: [mockEntryInclude],
};
