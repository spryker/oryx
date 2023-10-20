import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ProductSoldByComponent } from './sold-by.component';

export const productSoldBySchema: ContentComponentSchema<ProductSoldByComponent> =
  {
    name: 'Sold by',
    group: 'Product',
    options: {},
  };
