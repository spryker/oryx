import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { MerchantDescriptionComponent } from './description.component';

export const merchantDescriptionSchema: ContentComponentSchema<MerchantDescriptionComponent> =
  {
    name: 'Description',
    group: 'Merchant',
    icon: IconTypes.Description,
  };
