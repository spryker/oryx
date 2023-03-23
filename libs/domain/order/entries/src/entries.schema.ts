import { ComponentGroup, ContentComponentSchema } from '@spryker-oryx/experience';
import { OrderEntriesComponent } from './entries.component';

export const orderEntriesSchema: ContentComponentSchema<OrderEntriesComponent> =
  {
    name: 'Order Entries',
    group: ComponentGroup.Order,
    options: {
      limit: {
        label: 'Limit',
        type: 'input',
        attributes: {
          type: 'number',
        },
      },
      threshold: {
        label: 'Threshold',
        type: 'input',
        attributes: {
          type: 'number',
        },
      },
    },
  };
