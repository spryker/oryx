import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductDescriptionComponent } from './description.component';

export const productDescriptionSchema: ContentComponentSchema<ProductDescriptionComponent> =
  {
    name: 'Product Description',
    group: 'Product',
    icon: IconTypes.Description,
    options: {
      lineClamp: { type: FormFieldType.Number, width: 100 },
      enableToggle: { type: FormFieldType.Boolean },
    },
  };
