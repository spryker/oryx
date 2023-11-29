export interface TextProperties {
  /**
   * The content of the text, which can include HTML. If HTML is used,
   * it will be sanitized to prevent XSS attacks.
   *
   * The html string is converted to Oryx design system HTML.
   */
  content?: string;
}
