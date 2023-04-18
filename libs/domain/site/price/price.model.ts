export interface PriceComponentAttributes {
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
}
