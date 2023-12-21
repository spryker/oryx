import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CartListComponent } from './list.component';

export const cartListComponentSchema: ContentComponentSchema<CartListComponent> =
  {
    name: 'List',
    group: 'Cart',
    icon: IconTypes.List,
  };
