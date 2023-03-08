import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { CartEntryRemoveComponent } from './remove-entry.component';

export const cartEntryRemoveComponentSchema: ContentComponentSchema<CartEntryRemoveComponent> =
  {
    type: 'oryx-cart-entry-remove',
    name: 'Cart entry remove',
    group: 'Cart',
    options: {
      silentRemove: {
        type: FormFieldType.Boolean,
        width: 100,
      },
    },
  };
