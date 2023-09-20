export interface SitePriceComponentAttributes {
  /**
   * The value property represents the price in cents. For example,
   * if the price is €12.34, the value should be set to `1234`.
   */
  value?: number;

  /**
   * The currency property represents the currency used for the price.
   * If not provided, the component will use the active currency.
   *
   * To explicitly set the currency, pass a string representing the
   * currency code (e.g. 'USD', 'EUR', etc.). The currency code should
   * be provided using the ISO 4217, which is a three-letter codes for
   * currencies used worldwide.
   */
  currency?: string;

  /**
   * The discounted property represents whether the price is discounted.
   * If set to true, the price will be rendered with the highlight color.
   *
   * @since 1.1.0
   */
  discounted?: boolean;

  /**
   * The original property represents whether the price should be
   * strikethrough. If set to true, the price will be rendered with a
   * line-through css style.
   *
   * @since 1.1.0
   */
  original?: boolean;
}
