import {
  ComponentGroup,
  ContentComponentSchema,
} from '@spryker-oryx/experience';
import { OrderTotalsComponent } from './totals.component';

export const orderTotalsSchema: ContentComponentSchema<OrderTotalsComponent> = {
  name: 'Order Totals',
  group: ComponentGroup.Order,
};
