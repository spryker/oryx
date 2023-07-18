import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
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
