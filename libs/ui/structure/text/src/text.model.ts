export interface TextProperties {
  /**
   * Indicates whether the text should truncate after a number of lines.
   */
  truncateAfter?: number;

  /**
   * Indicates whether a read more link should be shown rendered.
   */
  showToggle: boolean;

  /**
   * Indicates that the full text is expanded.
   *
   * @default false
   */
  expanded: boolean;
}
