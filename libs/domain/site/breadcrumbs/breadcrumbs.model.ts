import { IconTypes } from '@spryker-oryx/ui/icon';

export interface SiteBreadcrumbsOptions {
  /**
   * Type of the icon for the divider.
   *
   * @default `IconTypes.Front`
   */
  dividerIcon?: IconTypes;

  /**
   * Render a divider between navigation links
   *
   * @default `true`
   */
  showDivider?: boolean;
}
