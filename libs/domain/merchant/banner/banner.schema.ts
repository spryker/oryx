import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantBannerComponent } from './banner.component';

export const merchantBannerSchema: ContentComponentSchema<MerchantBannerComponent> =
  {
    name: 'Banner',
    group: 'Merchant',
    icon: 'image',
  };
