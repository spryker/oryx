import { ContentComponentSchema } from '@spryker-oryx/experience';
import { ProductOffersComponent } from './offers.component';

export const merchantOfferListSchema: ContentComponentSchema<ProductOffersComponent> =
  {
    name: 'Offer List',
    group: 'Merchant',
    options: {},
  };
