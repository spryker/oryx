import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CartTotalsComponent } from './totals.component';

export const cartTotalsComponentSchema: ContentComponentSchema<CartTotalsComponent> =
  {
    name: 'Cart totals',
    group: 'Cart',
    icon: IconTypes.BulletList,
    options: {
      reference: {
        type: FormFieldType.Text,
      },
    },
  };
