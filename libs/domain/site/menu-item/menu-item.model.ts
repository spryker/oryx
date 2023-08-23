export interface SiteMenuItemContent {
  text?: string;
}

export interface SiteMenuItemOptions {
  /**
   * url item should link to.
   */
  url?: string;

  /**
   * route for url.
   */
  type?: string;

  /**
   * id after the type in the url.
   */
  id?: string;

  /**
   * Supports displaying a prefixed icon.
   */
  icon?: string;
}
