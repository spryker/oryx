import { ContentComponentSchema } from '@spryker-oryx/experience';
import { MerchantScheduleComponent } from './schedule.component';

export const merchantScheduleComponentSchema: ContentComponentSchema<MerchantScheduleComponent> =
  {
    name: 'Schedule',
    group: 'Merchant',
    icon: 'schedule',
  };
