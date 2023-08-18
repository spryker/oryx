import { RouteType } from '@spryker-oryx/router';
import { ColorType, LinkAppearance } from '@spryker-oryx/ui/link';

export interface ContentLinkContent {
  text?: string;
}

export interface ContentLinkOptions {
  url?: string;
  type?: RouteType;
  id?: string;
  params?: Record<string, string>;

  color?: ColorType;

  /**
   * Both links and button links support a prefixed icon.
   */
  icon?: string;

  /**
   * The label is used for an optimized aria-label on the link. When the label is not
   * provided, screen readers will read the text of the link.
   */
  label?: string;

  /**
   * The target can be used to open a link in a new (named) window.
   */
  target?: string;

  /**
   * Prevents the new page from being able to access the window.opener property and ensures
   * it runs in a separate process.
   */
  noopener?: boolean;

  /**
   * Blocks crawlers like Google Search Index to follow the link during indexing.
   */
  nofollow?: boolean;

  /**
   * Renders the link as a button (`oryx-button`), while remaining an anchor element
   * under the hood.
   */
  button?: boolean;

  /**
   * Indicates that the link text should truncate when it has multiple lines.
   */
  singleLine?: boolean;

  /**
   * Changes the appearance of the content link
   */
  appearance?: LinkAppearance;
}
