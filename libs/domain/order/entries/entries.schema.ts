import { ContentComponentSchema } from '@spryker-oryx/experience';
import { OrderEntriesComponent } from './entries.component';

export const orderEntriesSchema: ContentComponentSchema<OrderEntriesComponent> =
  {
    name: 'Order Entries',
    group: 'Order',
    options: {
      limit: {
        type: 'input',
        attributes: {
          type: 'number',
        },
      },
      threshold: {
        type: 'input',
        attributes: {
          type: 'number',
        },
      },
    },
  };
