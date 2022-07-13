export interface CartTotals {
  grandTotal: number;
  priceToPay: number;
  expenseTotal?: number;
  discountTotal?: number;
  taxTotal?: number;
  subtotal?: number;
}

export interface CartAttributes {
  name: string;
  isDefault: boolean;
  totals: CartTotals;
  discounts?: unknown[];
  thresholds?: unknown[];
  priceMode?: string;
  currency?: string;
  store?: string;
}

export interface Cart extends CartAttributes {
  id: string;
  products?: CartEntry[];
}

export interface CartEntryCalculations {
  unitPrice?: number;
  sumPrice?: number;
  taxRate?: number;
  unitNetPrice?: number;
  sumNetPrice?: number;
  unitGrossPrice?: number;
  sumGrossPrice?: number;
  unitTaxAmountFullAggregation?: number;
  sumTaxAmountFullAggregation?: number;
  sumSubtotalAggregation?: number;
  unitSubtotalAggregation?: number;
  unitProductOptionPriceAggregation?: number;
  sumProductOptionPriceAggregation?: number;
  unitDiscountAmountAggregation?: number;
  sumDiscountAmountAggregation?: number;
  unitDiscountAmountFullAggregation?: number;
  sumDiscountAmountFullAggregation?: number;
  unitPriceToPayAggregation?: number;
  sumPriceToPayAggregation?: number;
}

export interface CartEntryAttributes {
  sku: string;
  quantity: number;
  groupKey: string;
  abstractSku: string;
  amount?: unknown;
  productOfferReference?: unknown;
  merchantReference?: unknown;
  calculations?: CartEntryCalculations;
  configuredBundle?: unknown;
  configuredBundleItem?: unknown;
  productConfigurationInstance?: unknown;
  salesUnit?: unknown;
  selectedProductOptions?: unknown[];
}

export interface CartEntry extends CartEntryAttributes {
  id: string;
}
