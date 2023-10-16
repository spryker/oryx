export interface CollapsibleAttributes {
  /**
   * allow to control expanded state of component
   */
  open?: boolean;

  /**
   * text for title label can be provided as an attribute
   * and as a content for named slot (slot="heading")
   */
  heading?: string;

  /**
   * Drives the UX of the collapsible.
   *
   * @defaults `CollapsibleAppearance.Block`.
   */
  appearance?: CollapsibleAppearance;

  /**
   * Prevent focus by keyboard navigation
   */
  nonTabbable?: boolean;

  /**
   * Indicates that the collapsible was opened by a user. We need this info since
   * we need to scroll the collapsible into the view port whenever it is opened by
   * the user. We do not like to do this when it's (initially) rendered `open`.
   */
  isManuallyOpened?: boolean;
}

export const enum CollapsibleAppearance {
  /**
   * Renders the toggle button on the far end of the collapsible.
   */
  Block = 'block',

  /**
   * Renders the toggle button next to the header.
   */
  Inline = 'inline',
}
