import { ContentComponentSchema } from '@spryker-oryx/experience';
import { PriceComponent } from './price.component';

export const sitePriceSchema: ContentComponentSchema<PriceComponent> = {
  name: 'Price',
  group: 'Site',
  icon: 'currency_exchange',
};
