import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { MerchantTitleComponent } from './title.component';

export const merchantTitleSchema: ContentComponentSchema<MerchantTitleComponent> =
  {
    name: 'Title',
    group: 'Merchant',
    icon: IconTypes.Title,
  };
