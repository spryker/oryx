export interface CartSummaryOptions {
  /**
   * The max visible quantity in the cart summary. When the quantity exceeds
   * this number, the UI will change to this number and adds a plus sign, e.g
   * "99+".
   */
  maxVisibleQuantity?: number;
}
