import {
  ApiCartModel,
  Cart,
  CartDiscount,
  CartEntry,
  CartTotals,
  Coupon,
  NormalizedTotals,
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

export const mockCartCoupon1: Coupon = {
  id: '1',
  code: 'couponCode_1',
  amount: 100,
  displayName: 'Coupon 1',
  expirationDateTime: '2021-12-31T23:59:59+00:00',
  discountType: 'percentage',
};

export const mockCartCoupon2: Coupon = {
  id: '2',
  code: 'couponCode_2',
  amount: 200,
  displayName: 'Coupon 2',
  expirationDateTime: '2021-12-31T23:59:59+00:00',
  discountType: 'percentage',
};

const mockFullCartTotals: CartTotals = {
  subtotal: 161942,
  grandTotal: 149867,
  priceToPay: 150867,
  taxTotal: 6386,
  discountTotal: 12075,
  expenseTotal: 1000,
  shipmentTotal: 1000,
};

const mockCartTotals: CartTotals = {
  subtotal: 161942,
  grandTotal: 149867,
  priceToPay: 150867,
  taxTotal: 1000,
  expenseTotal: 100,
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

const mockMultipleDiscounts: CartDiscount[] = [
  {
    displayName: '€5 every tuesday and wednesday for buying 5 items',
    amount: 12075,
  },
  {
    displayName: 'Happy birthday!',
    amount: 1000,
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
  coupons: [mockCartCoupon1],
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

export const mockCartWithMultipleDiscount: Cart = {
  ...mockBaseCart,
  id: 'discount-multi-rows',
  totals: mockCartTotalsWithDiscount,
  discounts: mockMultipleDiscounts,
};

export const mockCartWithoutDiscount: Cart = {
  ...mockBaseCart,
  id: 'discount-no-rows',
  discounts: [],
};

export const mockCartWithMultipleProducts: Cart = {
  ...mockBaseCart,
  id: 'multiple',
  products: [mockCartEntry, mockCartEntry2, mockCartEntry3],
  coupons: [mockCartCoupon1, mockCartCoupon2],
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

export const mockNormalizedCartTotals: NormalizedTotals = {
  ...mockFullCartTotals,
  discounts: [...mockMultipleDiscounts],
  currency: 'EUR',
  priceMode: PriceMode.GrossMode,
};

export const mockNormalizedCartTotalsSingleDiscount: NormalizedTotals = {
  ...mockFullCartTotals,
  discounts: [...mockDiscounts],
  currency: 'EUR',
  priceMode: PriceMode.GrossMode,
  shipmentTotal: 0,
};

export const mockNormalizedCartTotalsNetMode: NormalizedTotals = {
  ...mockNormalizedCartTotals,
  priceMode: PriceMode.NetMode,
  shipmentTotal: undefined,
};
