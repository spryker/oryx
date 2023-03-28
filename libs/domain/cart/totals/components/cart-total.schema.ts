import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { DiscountRowsAppearance } from './cart-total.model';

export const cartTotalsSubtotalComponentSchema: ContentComponentSchema = {
  name: 'Cart totals subtotal',
  group: 'Cart',
};

export const cartTotalsDiscountComponentSchema: ContentComponentSchema = {
  name: 'Cart totals discount',
  group: 'Cart',
  options: {
    discountRowsAppearance: {
      type: FormFieldType.Select,
      options: [
        { value: DiscountRowsAppearance.None },
        { value: DiscountRowsAppearance.Inline },
        { value: DiscountRowsAppearance.Collapsed },
        { value: DiscountRowsAppearance.Expanded },
      ],
    },
  },
};

export const cartTotalsExpenseComponentSchema: ContentComponentSchema = {
  name: 'Cart totals expense',
  group: 'Cart',
};

export const cartTotalsTaxComponentSchema: ContentComponentSchema = {
  name: 'Cart totals tax',
  group: 'Cart',
};

export const cartTotalsDeliveryComponentSchema: ContentComponentSchema = {
  name: 'Cart totals delivery',
  group: 'Cart',
};

export const cartTotalsTotalComponentSchema: ContentComponentSchema = {
  name: 'Cart totals total',
  group: 'Cart',
  options: {
    deliveryMessage: { type: FormFieldType.Text },
  },
};
