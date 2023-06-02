export interface CartItemAvailabilityOptions {
  /**
   * The stock threshold indicates the absolute number of items that must be available till
   * the stock is indicated as "low stock".
   */
  threshold?: number;
  enableIndicator?: boolean;
  enableExactStock?: boolean;
}

export enum StockAvailability {
  InStock = 'in-stock',
  OutOfStock = 'out-of-stock',
  LowStock = 'low-stock',
}
