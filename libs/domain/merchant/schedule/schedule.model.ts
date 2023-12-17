import { HeadingTag } from '@spryker-oryx/ui/heading';

export interface MerchantScheduleComponentOptions {
  /**
   * Allows to render the schedule heading inside a specific tag.
   */
  tag?: HeadingTag;

  /**
   * Allows to render only a specific type of schedule. If not set, all types
   * will be rendered.
   */
  type?: 'weekdays' | 'dates';

  filterBefore?: 'week' | 'month' | 'quarter' | 'year';

  filterAfter?: 'week' | 'month' | 'quarter' | 'year';
}
