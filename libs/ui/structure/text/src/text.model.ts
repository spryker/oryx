export interface TextProperties {
  /**
   * Indicates whether a read more link should be hidden.
   */
  hideToggle: boolean;

  /**
   * Indicates that the full text is truncated.
   * Requires setting the '--line-clamp' css variable to control
   * the amount of truncated lines
   *
   * @default true
   */
  truncated: boolean;

  /**
   * Indicates that the text is expanded by default
   *
   * @default false
   */
  defaultExpanded?: boolean;
}
