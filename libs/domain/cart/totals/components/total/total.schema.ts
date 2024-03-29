import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CartTotalsTotalComponent } from './total.component';

export const cartTotalsTotalComponentSchema: ContentComponentSchema<CartTotalsTotalComponent> =
  {
    name: 'Cart totals total',
    group: 'Cart',
    options: {
      enableTaxMessage: { type: FormFieldType.Boolean },
    },
  };
