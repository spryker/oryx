import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ProductDescriptionComponent } from './description.component';

export const productDescriptionSchema: ContentComponentSchema<ProductDescriptionComponent> =
  {
    name: 'Product description',
    group: 'Product',
    icon: '<path d="M3.33334 13.1364C2.97778 13.1364 2.66667 12.9909 2.4 12.7C2.13334 12.4091 2 12.0697 2 11.6818L2 5.45455C2 5.06667 2.13333 4.72727 2.4 4.43636C2.66667 4.14545 2.97778 4 3.33333 4H20.6667C21.0222 4 21.3333 4.14545 21.6 4.43636C21.8667 4.72727 22 5.06667 22 5.45455V11.6818C22 12.0697 21.8667 12.4091 21.6 12.7C21.3333 12.9909 21.0222 13.1364 20.6667 13.1364H3.33334ZM4 11H20V6H4V11Z" /><rect x="2" y="15" width="20" height="2" rx="1" /><rect x="2" y="18" width="8" height="2" rx="1" />',
    options: {
      truncateAfter: { type: FormFieldType.Number, width: 100 },
      expandInitially: { type: FormFieldType.Boolean },
      enableToggle: { type: FormFieldType.Boolean },
    },
  };
