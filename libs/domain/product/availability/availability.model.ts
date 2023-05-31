export interface CartItemAvailabilityOptions {
  threshold?: number;
  enableIndicator?: boolean;
  enableExactStock?: boolean;
}

export enum StockAvailability {
  InStock = 'in-stock',
  OutOfStock = 'out-of-stock',
  LowStock = 'low-stock',
}
