export interface ProductMediaComponentOptions {
  /**
   * Preview image src
   *
   * By default selects first 'externalUrlSmall' image of the product
   */
  src?: string;

  /**
   * Src for the high definition version of image.
   * Can accept url or null to not render it.
   *
   * By default selects first 'externalUrlLarge' image of the product
   */
  hdSrc?: string | null;

  /**
   * Breakpoint that define min-width of the screen
   * when high resolution version should be rendered.
   *
   * @default 768
   */
  breakpoint?: number;

  /**
   * The alt tags for the image media.
   *
   * @default the product name
   */
  alt?: string;

  /**
   * Preview image loading
   *
   * @default 'lazy'
   */
  loading?: 'lazy' | 'auto' | 'eager';
}
