import { CartDiscount } from "./cart.model";

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
    discounts?: CartDiscount[];
}
