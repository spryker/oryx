import { CartDiscount, FormattedDiscount } from './cart.model';

export interface NormalizedTotals {
  currency?: string;
  subtotal?: number;
  total?: number;
  taxTotal?: number;
  expenseTotal?: number;
  grandTotal?: number;
  priceToPay?: number;
  canceledTotal?: number;
  remunerationTotal?: number;
  priceMode?: string;
  discountTotal?: number;
  discounts?: CartDiscount[];
}

export interface FormattedTotals {
  currency?: string;
  subtotal?: string;
  total?: string;
  taxTotal?: string;
  expenseTotal?: string;
  grandTotal?: string;
  priceToPay?: string;
  canceledTotal?: string;
  remunerationTotal?: string;
  priceMode?: string;
  discountTotal?: string;
  discounts?: FormattedDiscount[];
}
