import { ContentComponentSchema } from '@spryker-oryx/experience';
import { FormFieldType } from '@spryker-oryx/form';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ProductAttributesComponent } from './attributes.component';

export const productAttributesSchema: ContentComponentSchema<ProductAttributesComponent> =
  {
    name: 'Product Attributes',
    group: 'Product',
    icon: IconTypes.List,
    options: {
      columnCount: {
        type: FormFieldType.Number,
        min: 1,
      },
    },
  };
