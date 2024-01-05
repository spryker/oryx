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
   * The key to use for storing the open state. If set, the open state is stored
   * in memory and restored when the component is used in the same session.
   */
  persistedStateKey?: string;
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
