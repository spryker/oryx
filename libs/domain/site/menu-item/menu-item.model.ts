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
  url?: string;

  /**
   * route for url. To be used together with id and looks like /type/id.
   */
  type?: string;

  /**
   * id after the type in the url. To be used together with type and looks like /type/id.
   */
  id?: string;

  /**
   * Supports displaying a prefixed icon.
   */
  icon?: string;

  /**
   * Determines the appearance of the menu item.
   */
  variation?: SiteMenuItemVariation;
}
