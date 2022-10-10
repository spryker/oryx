export interface CartTotalsComponentOptions {
  /**
   * Indicates whether to render the subtotals.
   */
  hideSubtotal?: boolean;

  /**
   * Indicates whether to render the tax.
   */
  hideTaxAmount?: boolean;

  /**
   * Indicates whether to render the tax included/excluded message.
   *
   * @default false
   */
  hideTaxMessage?: boolean;

  /**
   * Indicates whether to render the discounts.
   *
   * @default false
   */
  hideDiscounts?: boolean;

  /**
   * Indicates whether to collapse the discount details. This will only be applied
   * when the hideDiscount is set to `false`.
   *
   * @default false
   */
  collapseDiscounts?: boolean;

  /**
   * Indicate whether to render the delivery.
   *
   * @default false
   */
  hideDelivery?: boolean;

  /**
   * Indicate whether to render the expense.
   *
   * @default false
   */
  hideExpense?: boolean;

  /**
   * Provides a static message next to the delivery link.
   */
  deliveryMessage?: string;
}
