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
   * The toggle button comes in 2 types:
   * - icon button
   * - text button
   *
   * The text appearance is particularly useful for an inline collapsible
   * that needs a show/hide button rather than an drop down/up icon.
   */
  toggleControlType?: CollapsibleToggleControlType;

  /**
   * Prevent focus by keyboard navigation
   */
  nonTabbable?: boolean;
}

export const enum CollapsibleToggleControlType {
  IconButton = 'iconButton',
  TextButton = 'textButton',
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
