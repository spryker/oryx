export interface TextProperties {
  /**
   * Indicates whether the text should truncate after a number of lines.
   */
  truncateAfter?: number;

  /**
   * Indicates whether the text elements should become inline when the text
   * is truncated.
   *
   * If truncated text with block elements might cause strange layout effects
   * with empty lines or text blocks.
   */
  concatenate?: boolean;

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
