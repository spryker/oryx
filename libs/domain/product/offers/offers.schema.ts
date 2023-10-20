import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ProductOffersComponent } from './offers.component';

export const productOffersSchema: ContentComponentSchema<ProductOffersComponent> =
  {
    name: 'Offers',
    group: 'Product',
    options: {},
  };
