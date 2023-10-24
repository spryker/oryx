import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantLegalComponent } from './legal.component';

export const merchantLegalContentSchema: ContentComponentSchema<MerchantLegalComponent> =
  {
    name: 'Legal',
    group: 'Merchant',
    icon: 'policy',
  };
