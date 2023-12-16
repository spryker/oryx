import { ContentComponentSchema } from '@spryker-oryx/experience';
import { HeadingTag } from '@spryker-oryx/ui/heading';
import { MerchantScheduleComponent } from './schedule.component';

export const merchantScheduleComponentSchema: ContentComponentSchema<MerchantScheduleComponent> =
  {
    name: 'Schedule',
    group: 'Merchant',
    icon: 'schedule',
    options: {
      tag: {
        type: 'select',
        options: [
          { value: HeadingTag.H1 },
          { value: HeadingTag.H2 },
          { value: HeadingTag.H3 },
          { value: HeadingTag.H4 },
          { value: HeadingTag.H5 },
          { value: HeadingTag.H6 },
          { value: HeadingTag.Bold },
          { value: HeadingTag.Caption },
          { value: HeadingTag.Small },
          { value: HeadingTag.Subtitle },
        ],
      },
    },
  };
