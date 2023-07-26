import { ContentComponentSchema } from '@spryker-oryx/experience';
import { SitePriceComponent } from './price.component';

export const sitePriceSchema: ContentComponentSchema<SitePriceComponent> = {
  name: 'Price',
  group: 'Site',
  icon: 'currency_exchange',
};
