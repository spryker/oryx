export interface CartTotalsComponentOptions {
  /**
   * Indicates whether to render the subtotals.
   */
  enableSubtotal?: boolean;

  /**
   * Indicates whether to render the tax.
   */
  enableTaxAmount?: boolean;

  /**
   * Indicates whether to render the tax included/excluded message.
   */
  enableTaxMessage?: boolean;

  /**
   * Indicates whether to render the discounts.
   */
  enableDiscounts?: boolean;

  /**
   * @default DiscountRowsAppearance.Inline
   */
  discountRowsAppearance?: DiscountRowsAppearance;

  /**
   * Indicate whether to render the delivery.
   */
  enableDelivery?: boolean;

  /**
   * Indicate whether to render the expense.
   */
  enableExpense?: boolean;

  /**
   * Provides a static message next to the delivery link.
   */
  deliveryMessage?: string;
}

export const enum DiscountRowsAppearance {
  /**
   * Indicates to not render discount rows at all.
   */
  None = 'none',

  /**
   * Indicates whether to render discount rows inline.
   */
  Inline = 'inline',

  /**
   * Indicates whether to use a collapsible UI for the discount rows and
   * have the rows collapsed by default.
   */
  Collapsed = 'collapsed',

  /**
   * Indicates whether to use a collapsible UI for the discount rows and
   * have the rows expanded by default.
   */
  Expanded = 'expanded',
}
