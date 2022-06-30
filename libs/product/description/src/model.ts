export interface ProductDescriptionContent {
  /**
   * Indicates the number of lines that are rendered. When the product description
   * exceeds the number of lines, the lines are truncated.
   *
   * An optional read-more link can render the full description, or you could use
   * another section on the page to render the full description without truncation.
   */
  truncateAfter?: number;

  /**
   * Indicates that a read-more link is created to expand the truncated description
   * in the full description.
   *
   * When undefined or false, the read more link is not rendered.
   */
  showToggle?: boolean;
  /**
   * Whether or not the description should be initially expanded or collapsed.
   *
   * When undefined or false, the description is collapsed.
   */
  expanded?: boolean;
}
