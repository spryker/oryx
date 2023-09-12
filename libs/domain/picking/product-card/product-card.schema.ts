import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ProductCardComponent } from './product-card.component';

export const productCardComponentSchema: ContentComponentSchema<ProductCardComponent> =
  {
    name: 'Product Card',
    group: 'Picking',
  };
