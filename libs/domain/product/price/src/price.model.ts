export interface ProductPriceOptions {
  /**
   * Indicates whether the original price should be rendered.
   */
  enableOriginalPrice?: boolean;

  /**
   * Indicates whether to show tax message for the price.
   */
  enableTaxMessage?: boolean;

  /**
   * Indicates whether to render a sales label in the price component.
   */
  enableSalesLabel?: boolean;
}

/**
 * @deprecated Not in use. Will be removed in the next major release.
 */
export interface Prices {
  original?: string | null;
  sales?: string | null;
}
