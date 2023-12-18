import { HeadingTag } from '@spryker-oryx/ui/heading';

export interface MerchantScheduleComponentOptions {
  /**
   * Allows to render the schedule heading with a specific tag,
   * e.g. `<h3>`, `<h4>`, `<h5>`, etc.
   * This is useful to align the heading with other headings on the page.
   */
  tag?: HeadingTag;

  /**
   * Used to filter the dates before the current week.
   */
  weeksBefore?: number;
  /**
   * Used to filter the dates after the current week.
   */
  weeksAfter?: number;
}
