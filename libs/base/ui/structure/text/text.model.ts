export interface TextProperties {
  /**
   * The content of the text, which can include HTML. If HTML is used,
   * it will be sanitized to prevent XSS attacks.
   *
   * The html will be modified by the RichTextController to add inline styles
   * that align with the Oryx design system. This allows integrations with
   * content management systems to use their own HTML while integrating
   * with the Oryx design system.
   */
  content?: string;
}
