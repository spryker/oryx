import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { FormFieldType } from 'libs/platform/form/src';
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
