import { IconTypes } from '@spryker-oryx/ui/icon';

export interface SiteBreadcrumbsOptions {
  /**
   * Type of the icon for the divider. Accepts `null` to hide the divider
   *
   * @default `IconTypes.Front`
   */
  dividerIcon?: IconTypes | null;

  /**
   * Render a divider between navigation links
   *
   * @default `true`
   */
  showDivider?: boolean;
}
