export interface AffixOptions {
  /**
   * Provides a icon type for the prefix. The icon type is used
   * to feed the `oryx-icon` with this type.
   */
  prefixIcon?: string;

  /** Adds background fill for the prefix area. */
  prefixFill?: boolean;

  /**
   * Provides a icon type for the suffix. The icon type is used
   * to feed the `oryx-icon` with this type.
   */
  suffixIcon?: string;

  /** Adds background fill for the suffix area. */
  suffixFill?: boolean;
}
