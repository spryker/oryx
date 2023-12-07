import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantLogoComponent } from './logo.component';

export const merchantLogoSchema: ContentComponentSchema<MerchantLogoComponent> =
  {
    name: 'Logo',
    group: 'Merchant',
    icon: 'diamond',
  };
