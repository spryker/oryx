export interface CartItemAvailabilityOptions {
  /**
   * The stock threshold indicates the absolute number of items that must be available till
   * the stock is indicated as "low stock".
   */
  threshold?: number;
  /**
   * The indicator shows an alert color based on the stock vs threshold. Green, amber, and red
   * are associated with in-stock, low-stock, and out-of-stock.
   */
  enableIndicator?: boolean;
  /**
   * Whenever the exact stock is known, it can be provided. The stock count can be freely used in
   * the location message (e.g. "Available (5 items)").
   *
   * The exact stock is omitted in case of out-of-stock status.
   */
  enableExactStock?: boolean;

  hideInStock?: boolean;
}

export enum StockAvailability {
  InStock = 'in-stock',
  OutOfStock = 'out-of-stock',
  LowStock = 'low-stock',
}
