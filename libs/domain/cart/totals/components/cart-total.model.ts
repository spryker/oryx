export interface CartTotalsDiscountOptions {
  /**
   * @default DiscountRowsAppearance.Inline
   */
  discountRowsAppearance?: DiscountRowsAppearance;
}

export interface CartTotalsTotalOptions {
  enableTaxMessage?: boolean;
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
