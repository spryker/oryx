import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { ProductAvailabilityComponent } from './availability.component';

export const ProductAvailabilitySchema: ContentComponentSchema<ProductAvailabilityComponent> =
  {
    name: 'Product Availability',
    group: 'Product',
    icon: 'inventory',
    options: {
      threshold: { type: FormFieldType.Number },
      enableExactStock: { type: FormFieldType.Boolean },
      enableIndicator: { type: FormFieldType.Boolean },
    },
  };
