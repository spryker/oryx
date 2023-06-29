import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { OrderTotalsComponent } from './totals.component';

export const orderTotalsComponentSchema: ContentComponentSchema<OrderTotalsComponent> =
  {
    name: 'Order totals',
    group: 'Order',
    icon: IconTypes.BulletList,
  };
