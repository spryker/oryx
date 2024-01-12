import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ProductDiscontinuedComponent } from './discontinued.component';

export const ProductDiscontinuedSchema: ContentComponentSchema<ProductDiscontinuedComponent> =
  {
    name: 'Product Discontinued',
    group: 'Product',
    icon: 'block',
    options: {},
  };
