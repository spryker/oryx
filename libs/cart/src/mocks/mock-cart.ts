export const mockCartTotals = {
  grandTotal: 0,
  priceToPay: 0,
};

export const mockCartResponse = {
  type: 'guest-carts',
  id: 'cart',
  attributes: {
    name: 'Shopping cart',
    isDefault: false,
    totals: mockCartTotals,
  },
  relationships: {
    'guest-cart-items': {
      data: [
        {
          type: 'guest-cart-items',
          id: 'entry',
        },
      ],
    },
  },
};

export const mockCartDefaultResponse = {
  type: 'guest-carts',
  id: 'default',
  attributes: {
    name: 'Shopping cart',
    isDefault: true,
    totals: mockCartTotals,
  },
  relationships: {
    'guest-cart-items': {
      data: [
        {
          type: 'guest-cart-items',
          id: 'entry',
        },
      ],
    },
  },
};

export const mockEntryInclude = {
  type: 'guest-cart-items',
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
