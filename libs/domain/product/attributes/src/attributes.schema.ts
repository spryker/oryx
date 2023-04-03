import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ProductAttributesComponent } from './attributes.component';

export const productTitleSchema: ContentComponentSchema<ProductAttributesComponent> =
  {
    name: 'Product attributes',
    group: 'Product',
    icon: '<path d="M8.47369 5H21V6.75H8.47369V5ZM8.47369 11.125H21V12.875H8.47369V11.125ZM8.47369 17.25H21V19H8.47369V17.25ZM4 5H5.80464V6.75H4V5ZM4 11.125H5.80464V12.875H4V11.125ZM4 17.25H5.80464V19H4V17.25Z" />',
    options: {
      columnCount: {
        type: 'input',
        attributes: { type: 'number', min: '1' },
      },
    },
  };
