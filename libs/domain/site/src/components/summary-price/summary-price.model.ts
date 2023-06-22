import { DirectiveResult } from "lit/async-directive";
import { Price } from "../../services/pricing";

export interface ChildPrice extends Price {
    label: string | DirectiveResult;
}

export interface FormattedPrice {
    label: string | DirectiveResult;
    formattedValue: string;
}

export interface SiteSummaryPriceComponentAttributes {
    label?: string | DirectiveResult;
    subtext?: string;
    value?: number;
    currency?: string;
    prices?: ChildPrice[];
    /**
     * @default PricesBehavior.Inline
     */
    pricesBehavior?: PricesBehavior;
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
  