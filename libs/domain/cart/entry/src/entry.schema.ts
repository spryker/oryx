import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
import { CartEntryComponent } from './entry.component';

export const cartEntryComponentSchema: ContentComponentSchema<CartEntryComponent> =
  {
    name: 'Cart Entry',
    group: 'Cart',
    icon: IconTypes.Cart,
    options: {
      readonly: {
        type: FormFieldType.Boolean,
        width: 100,
      },
      enableItemImage: {
        type: FormFieldType.Boolean,
        width: 100,
      },
      removeByQuantity: {
        type: 'select',
        options: [{ value: 'allowZero' }, { value: 'showBin' }],
        width: 100,
      },
      confirmBeforeRemove: {
        type: FormFieldType.Boolean,
        width: 100,
      },
      notifyOnUpdate: {
        type: FormFieldType.Boolean,
      },
      notifyOnRemove: {
        type: FormFieldType.Boolean,
      },
    },
  };
