export interface ProductCardComponentOptions {
  sku?: string;

  /**
   * Indicates maximum amount of lines after truncation of title
   *
   * @default 1;
   */
  truncateTitleAfter?: number;

  /** Indicates whether the product title should be rendered  */
  hideTitle?: boolean;

  /** Indicates whether the product price should be rendered  */
  hidePrice?: boolean;

  /** Indicates whether the product rating should be rendered  */
  hideRating?: boolean;

  /** Indicates whether the product labels should be rendered  */
  hideLabels?: boolean;

  /** Indicates whether the add to favorites button should be rendered  */
  hideFavorites?: boolean;
}
