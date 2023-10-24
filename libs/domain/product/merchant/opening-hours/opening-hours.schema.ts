import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantOpeningsHoursComponent } from './opening-hours.component';

export const merchantOpeningHoursSchema: ContentComponentSchema<MerchantOpeningsHoursComponent> =
  {
    name: 'Opening hours',
    group: 'Merchant',
    icon: 'schedule',
  };
