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
   * Adds a read-more link to expand the truncated description into the full description.
   */
  enableToggle?: boolean;

  /**
   * Whether or not the description should be initially expanded or not.
   *
   * When undefined or false, the description is truncated.
   */
  expandInitially?: boolean;
}
