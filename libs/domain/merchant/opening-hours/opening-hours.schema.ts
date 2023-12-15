import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantOpeningHoursComponent } from './opening-hours.component';

export const merchantOpeningHoursComponentSchema: ContentComponentSchema<MerchantOpeningHoursComponent> =
  {
    name: 'Opening hours',
    group: 'Merchant',
    icon: 'schedule',
  };
