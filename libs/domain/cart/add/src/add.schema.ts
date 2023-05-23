import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CartAddComponent } from './add.component';

export const cartAddComponentSchema: ContentComponentSchema<CartAddComponent> =
  {
    name: 'Add to Cart',
    group: 'Cart',
    icon: IconTypes.CartAdd,
    options: {
      hideQuantityInput: {
        type: FormFieldType.Boolean,
      },
      outlined: {
        type: FormFieldType.Boolean,
      },
    },
  };
