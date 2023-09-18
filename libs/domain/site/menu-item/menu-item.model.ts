import { LinkOptions } from '@spryker-oryx/site';

export enum SiteMenuItemVariation {
  Navigation = 'navigation',
}

export interface SiteMenuItemContent {
  text?: string;
}

export interface SiteMenuItemOptions {
  /**
   * url item should link to. This is the absolute url and looks like /account/overview.
   */
  url?: string | LinkOptions;

  /**
   * Supports displaying a prefixed icon.
   */
  icon?: string;

  /**
   * Determines the appearance of the menu item.
   */
  variation?: SiteMenuItemVariation;
}
