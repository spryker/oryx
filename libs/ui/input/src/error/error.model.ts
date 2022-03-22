export interface ErrorOptions {
  /**
   * The `errorMessage` is rendered in the error message.
   *
   * Custom content can be placed alternatively using a slot:
   *
   * ```html
   * <div slot="error">custom error content</div>
   * ```
   */
  errorMessage?: string;

  /**
   * Indicates that the form control has an error. You do not need to specify this when
   * an error message or content is provided, but in case you like to use the error state
   * without any error message, you can use this in isolation.
   */
  hasError?: boolean;
}
