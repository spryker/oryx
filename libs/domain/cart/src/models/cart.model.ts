export interface CartId {
  id: string;
}

export enum PriceMode {
  GrossMode = 'GROSS_MODE',
  NetMode = 'NET_MODE',
}

export interface CartDiscount {
  displayName: string;
  amount: number;
  code?: string;
}

export interface Cart extends CartId {
  name: string;
  isDefault: boolean;
  totals: CartTotals;
  priceMode: PriceMode;
  discounts?: CartDiscount[];
  thresholds?: unknown[];
  currency?: string;
  store?: string;
  products?: CartEntry[];
  version?: string;
}

export interface CartEntry {
  sku: string;
  quantity: number;
  /**
   * The groupKey is used to identify and group together items that are
   * the same product but with different options.
   */
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
  /**
   * The subtotal of the cart, including or excluding tax depending on the configuration.
   */
  subtotal?: number;
  /**
   * The sub total of the cart.
   */
  grandTotal: number;
  /**
   * Total amount that must be paid including tax and fees but excluding discounts.
   *
   * As long as the user have not selected a shipment or payment method, this value is misleading though.
   */
  priceToPay: number;
  /**
   * Additional fees that are added to the cart totals.
   */
  expenseTotal?: number;
  /**
   * Total amount of discounts (if any)
   */
  discountTotal?: number;
  /**
   * Total amount of shipment
   */
  shipmentTotal?: number;
  /**
   * Total amount of tax for the cart.
   */
  taxTotal?: number;
}

export type CartTotalCalculations = {
  [key in keyof CartTotals]?: string;
};

export interface FormattedCartTotals {
  calculations: CartTotalCalculations;
  priceMode: PriceMode;
  itemsQuantity: number | null;
  discounts?: FormattedDiscount[];
}

export interface FormattedDiscount extends Omit<CartDiscount, 'amount'> {
  amount: string;
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

export interface NormalizedTotals extends CartTotals {
  currency?: string;
  priceMode?: string;
  discounts?: CartDiscount[];
}
