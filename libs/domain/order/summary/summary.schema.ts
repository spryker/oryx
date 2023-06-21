import { ContentComponentSchema } from '@spryker-oryx/experience';
import { OrderSummaryComponent } from './summary.component';

export const orderSummarySchema: ContentComponentSchema<OrderSummaryComponent> =
  {
    name: 'Order Summary',
    group: 'Order',
  };
