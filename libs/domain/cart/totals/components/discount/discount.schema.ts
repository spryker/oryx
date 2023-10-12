import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { DiscountRowsAppearance } from './discount.model';

export const cartTotalsDiscountComponentSchema: ContentComponentSchema = {
  name: 'Cart totals dicount',
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
