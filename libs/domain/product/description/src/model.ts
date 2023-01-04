export interface ProductDescriptionOptions {
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
   * When true, the read more link is not rendered.
   */
  hideToggle?: boolean;

  /**
   * Whether or not the description should be initially expanded or not.
   *
   * When undefined or false, the description is truncated.
   */
  defaultExpanded?: boolean;
}
