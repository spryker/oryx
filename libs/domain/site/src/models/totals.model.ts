import { DirectiveResult } from 'lit/directive';

export interface TotalsConfig {
  label?: string | DirectiveResult;
  subtext?: string | DirectiveResult;
  value?: number | string;
  currency?: string;
  prices?: TotalPrice[];
  /**
   * @default PricesBehavior.Inline
   */
  pricesBehavior?: PricesBehavior;
  delimiter?: boolean;
  accented?: boolean;
}

export interface NormalizedTotals {
  currency?: string;
  subtotal?: number;
  total?: number;
  taxTotal?: number;
  expenseTotal?: number;
  grandTotal?: number;
  canceledTotal?: number;
  remunerationTotal?: number;
  priceMode?: string;
  discountTotal?: number;
  discounts?: TotalPrice[];
}

export interface TotalPrice {
  label: string | DirectiveResult;
  value: number | string;
  currency?: string;
}

export interface FormattedPrice {
  label: string | DirectiveResult;
  formattedValue: string;
}

export const enum PricesBehavior {
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
