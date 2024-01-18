import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { CartTotalsComponent } from './totals.component';

export const cartTotalsComponentSchema: ContentComponentSchema<CartTotalsComponent> =
  {
    name: 'Cart totals',
    group: 'Cart',
    icon: IconTypes.BulletList,
    composition: true,
  };
