export const mockCartTotals = {
  grandTotal: 'cart',
};

export const mockDefaultCartTotals = {
  grandTotal: 'default',
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
    totals: mockDefaultCartTotals,
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
    quantity: 1,
  },
};

export const mockNormalizedCart = {
  id: mockCartResponse.id,
  ...mockCartResponse.attributes,
  products: [
    {
      id: mockEntryInclude.id,
      ...mockEntryInclude.attributes,
    },
  ],
};

export const mockNormalizedDefaultCart = {
  id: mockCartDefaultResponse.id,
  ...mockCartDefaultResponse.attributes,
  products: [
    {
      id: mockEntryInclude.id,
      ...mockEntryInclude.attributes,
    },
  ],
};

export const mockNormalizedCartWithoutProducts = {
  id: mockCartResponse.id,
  ...mockCartResponse.attributes,
};

export const mockNormalizedDefaultCartWithoutProducts = {
  id: mockCartDefaultResponse.id,
  ...mockCartDefaultResponse.attributes,
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
