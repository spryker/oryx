import { DiscountRowsAppearance } from '@spryker-oryx/cart/totals';

const types = [
  'subtotal',
  'discount',
  'tax',
  'expense',
  'delivery',
  'total',
].map((type) => ({
  id: `only ${type}`,
  components: [{ type: `oryx-cart-totals-${type}` }],
}));

const discountVariations = [
  DiscountRowsAppearance.Expanded,
  DiscountRowsAppearance.Collapsed,
  DiscountRowsAppearance.Inline,
  DiscountRowsAppearance.None,
].map((type) => ({
  id: `discount (${type})`,
  components: [
    { type: 'oryx-cart-totals-subtotal' },
    {
      type: `oryx-cart-totals-discount`,
      options: {
        data: { discountRowsAppearance: type },
      },
    },
    { type: 'oryx-cart-totals-total' },
  ],
}));

export const cartTotalsStaticData = [
  {
    id: 'all',
    components: [
      { type: 'oryx-cart-totals-subtotal' },
      { type: 'oryx-cart-totals-discount' },
      { type: 'oryx-cart-totals-expense' },
      { type: 'oryx-cart-totals-tax' },
      { type: 'oryx-cart-totals-delivery' },
      { type: 'oryx-cart-totals-total' },
    ],
  },
  {
    id: 'small',
    components: [
      { type: 'oryx-cart-totals-subtotal' },
      { type: 'oryx-cart-totals-discount' },
      { type: 'oryx-cart-totals-total' },
    ],
  },
  ...types,
  ...discountVariations,
  {
    id: 'small (without message)',
    components: [
      { type: 'oryx-cart-totals-subtotal' },
      { type: 'oryx-cart-totals-discount' },
      {
        type: 'oryx-cart-totals-total',
        options: { data: { enableTaxMessage: false } },
      },
    ],
  },
];
