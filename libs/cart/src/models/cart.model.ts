export interface CartId {
  id: string;
}

export interface Cart extends CartId {
  name: string;
  isDefault: boolean;
  totals: CartTotals;
  discounts?: unknown[];
  thresholds?: unknown[];
  priceMode?: string;
  currency?: string;
  store?: string;
  products?: CartEntry[];
}

export interface CartEntry {
  sku: string;
  quantity: number;
  groupKey: string;
  abstractSku: string;
  amount?: unknown;
  productOfferReference?: unknown;
  merchantReference?: unknown;
  calculations?: CartCalculations;
  configuredBundle?: unknown;
  configuredBundleItem?: unknown;
  productConfigurationInstance?: unknown;
  salesUnit?: unknown;
  selectedProductOptions?: ProductOption[];
}

export interface CartTotals {
  grandTotal: number;
  priceToPay: number;
  expenseTotal?: number;
  discountTotal?: number;
  taxTotal?: number;
  subtotal?: number;
}

export interface CartCalculations {
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

export interface ProductOption {
  optionGroupName?: string;
  sku?: string;
  optionName?: string;
  price?: number;
}
