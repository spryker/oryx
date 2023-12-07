import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantContactComponent } from './contact.component';

export const merchantContactSchema: ContentComponentSchema<MerchantContactComponent> =
  {
    name: 'Contact',
    group: 'Merchant',
    icon: 'contact_phone',
  };
