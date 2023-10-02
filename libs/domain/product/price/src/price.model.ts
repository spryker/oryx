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
 * @deprecated not used anywhere. Will be removed in 2.0.0.
 */
export interface Prices {
  original?: string | null;
  sales?: string | null;
}
