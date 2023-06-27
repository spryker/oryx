export interface ProductCardOptions {
  /** The product SKU is used to resolve the product. */
  sku?: string;

  template?: 'grid' | 'list';

  /** Indicates whether the product title should be rendered  */
  enableTitle?: boolean;

  /**
   * Indicates maximum amount of lines instantly visible. If there are more lines
   * available, they'll be  truncated.
   */
  titleLineClamp?: number;

  /** Indicates whether the product media (image) should be rendered  */
  enableMedia?: boolean;

  /** Indicates whether the product price should be rendered  */
  enablePrice?: boolean;

  /** Indicates whether the product rating should be rendered  */
  enableRating?: boolean;

  /** Indicates whether the product labels should be rendered  */
  enableLabels?: boolean;

  /** Indicates whether the add to favorites button should be rendered  */
  enableWishlist?: boolean;

  /** Indicates whether the add to cart should be rendered  */
  enableAddToCart?: boolean;
}
