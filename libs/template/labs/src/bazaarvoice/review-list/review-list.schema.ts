import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from 'libs/platform/form/src';
import { BazaarvoiceReviewListComponent } from './review-list.component';

export const reviewListComponentSchema: ContentComponentSchema<BazaarvoiceReviewListComponent> =
  {
    name: 'Product review list',
    category: 'ACP',
    group: 'BazaarVoice',
    icon: `<path d="M21.7,9.3c-0.2-0.6-0.8-1-1.4-1.1l-5-0.3l-1.8-4.7c-0.2-0.6-0.8-1-1.5-1c-0.6,0-1.2,0.4-1.5,1L8.7,7.9l-5,0.3 c-0.6,0-1.2,0.5-1.4,1.1c-0.2,0.6,0,1.3,0.5,1.7l3.9,3.2l-1.3,4.9c-0.2,0.6,0.1,1.3,0.6,1.7c0.5,0.4,1.2,0.4,1.8,0l4.2-2.7l4.2,2.7 c0.3,0.2,0.5,0.2,0.8,0.2c0.3,0,0.6-0.1,0.9-0.3c0.5-0.4,0.8-1,0.6-1.7l-1.3-4.8l3.9-3.2C21.7,10.6,21.9,9.9,21.7,9.3z M8.2,14.6 C8.3,14,8.1,13.4,7.7,13L3.8,9.8l5-0.3c0.6,0,1.1-0.4,1.4-1L12,3.8l1.8,4.7c0.2,0.6,0.8,0.9,1.4,1l5,0.3L16.3,13 c-0.5,0.4-0.7,1-0.6,1.6l1.3,4.9l-4.2-2.7c-0.5-0.3-1.2-0.4-1.7,0l-4.2,2.7L8.2,14.6z"/>`,
    options: {
      enableSearch: {
        type: FormFieldType.Boolean,
      },
    },
  };
