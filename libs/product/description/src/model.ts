export interface ProductDescriptionContent {
  /**
   * Indicates the number of characters that are shown before truncation. When
   * the text is long enough to be truncated, a "read more" button will be
   * rendered, so that the user can toggle the view.
   *
   * When the value is not given, the description will not be truncated.
   *
   * @default undefined
   */
  truncateCharacterCount?: number;
}
