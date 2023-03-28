import {
  ApiCartModel,
  Cart,
  CartDiscount,
  CartEntry,
  CartTotals,
  PriceMode,
} from '@spryker-oryx/cart';

export const mockCartEntry: CartEntry = {
  sku: '1',
  groupKey: 'groupKey',
  abstractSku: 'abstractSku',
  quantity: 1,
  calculations: {
    unitPrice: 100,
    sumPrice: 200,
    sumPriceToPayAggregation: 200,
  },
};

export const mockCartEntry2: CartEntry = {
  sku: '2',
  groupKey: 'groupKey',
  abstractSku: 'abstractSku',
  quantity: 1,
  calculations: {
    unitPrice: 595,
    sumPrice: 595,
    sumPriceToPayAggregation: 595,
  },
};

export const mockCartEntry3: CartEntry = {
  sku: '3',
  groupKey: 'groupKey',
  abstractSku: 'abstractSku',
  quantity: 7,
  calculations: {
    unitPrice: 195,
    sumPrice: 1365,
    sumPriceToPayAggregation: 1365,
  },
};

export const mockCartEntry4: CartEntry = {
  sku: '4',
  groupKey: 'groupKey',
  abstractSku: 'abstractSku',
  quantity: 150,
  calculations: {
    unitPrice: 1,
    sumPrice: 150,
    sumPriceToPayAggregation: 150,
  },
};

const mockFullCartTotals: CartTotals = {
  subtotal: 161942,
  grandTotal: 149867,
  priceToPay: 150867,
  taxTotal: 6386,
  discountTotal: 12075,
  expenseTotal: 1000,
};

const mockCartTotals: CartTotals = {
  subtotal: 161942,
  grandTotal: 149867,
  priceToPay: 150867,
  taxTotal: 1000,
};

const mockCartTotalsWithTax: CartTotals = {
  ...mockCartTotals,
  taxTotal: 6386,
};

const mockCartTotalsWithDiscount: CartTotals = {
  ...mockCartTotals,
  discountTotal: 12075,
};

const mockCartTotalsWithExpense: CartTotals = {
  ...mockCartTotals,
  expenseTotal: 1000,
};

const mockDiscounts: CartDiscount[] = [
  {
    displayName: '€5 every tuesday and wednesday for buying 5 items',
    amount: 12075,
  },
];
/**
 * The base cart is in gross mode and contains a single product.
 */
export const mockBaseCart: Cart = {
  id: 'cart',
  name: 'Shopping cart',
  isDefault: false,
  totals: mockCartTotals,
  priceMode: PriceMode.GrossMode,
  products: [mockCartEntry],
};

export const mockDefaultCart: Cart = {
  id: 'default',
  name: 'Shopping cart',
  isDefault: true,
  totals: mockFullCartTotals,
  priceMode: PriceMode.GrossMode,
  products: [mockCartEntry],
  discounts: mockDiscounts,
};

// TODO: the Cart model doesn't fit empty carts, either the model is wrong or
// the logic inside cart totals is expecting the wrong data
export const mockEmptyCart: Partial<Cart> = {
  id: 'empty',
};

export const mockNetCart: Cart = {
  ...mockBaseCart,
  id: 'net',
  priceMode: PriceMode.NetMode,
  totals: mockFullCartTotals,
};

export const mockCartWithTax: Cart = {
  ...mockBaseCart,
  id: 'tax',
  totals: mockCartTotalsWithTax,
};

export const mockCartWithExpense: Cart = {
  ...mockBaseCart,
  id: 'expense',
  totals: mockCartTotalsWithExpense,
};

export const mockCartWithDiscount: Cart = {
  ...mockBaseCart,
  id: 'discount',
  totals: mockCartTotalsWithDiscount,
  discounts: mockDiscounts,
};

export const mockCartWithoutDiscountRows: Cart = {
  ...mockBaseCart,
  id: 'discount-no-rows',
  totals: mockCartTotalsWithDiscount,
  discounts: [],
};

export const mockCartWithMultipleProducts: Cart = {
  ...mockBaseCart,
  id: 'multiple',
  products: [mockCartEntry, mockCartEntry2, mockCartEntry3],
};

export const mockCartLarge: Cart = {
  ...mockBaseCart,
  id: 'large',
  products: [mockCartEntry, mockCartEntry2, mockCartEntry3, mockCartEntry4],
};

export const mockGetCartsResponse: ApiCartModel.Response = {
  data: {
    attributes: mockBaseCart,
  },
  included: [
    {
      type: ApiCartModel.Includes.Items,
      id: 'entry',
      attributes: mockCartEntry,
    },
  ],
};
