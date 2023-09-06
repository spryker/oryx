import type { PriceMode, ProductOption } from '@spryker-oryx/cart';
import { Address } from '@spryker-oryx/user';

export interface OrderTotals {
  subtotal?: number;
  grandTotal: number;
  expenseTotal?: number;
  discountTotal?: number;
  taxTotal?: number;
  canceledTotal?: number;
  remunerationTotal?: number;
}

export interface OrderPayment {
  amount: number;
  paymentProvider: string;
  paymentMethod: string;
}

export interface OrderShipment {
  shipmentMethodName: string;
  carrierName: string;
  deliveryTime?: number;
  defaultGrossPrice: number;
  defaultNetPrice: number;
  currencyIsoCode: string;
}

export interface OrderItem {
  salesOrderConfiguredBundle?: unknown;
  salesOrderConfiguredBundleItem?: unknown;
  /**
   * Name of the Product.
   */
  name: string;
  /**
   * Product SKU number.
   */
  sku: string;
  /**
   * Total price of all products in the order of the same type
   */
  sumPrice: number;
  /**
   * Number of products in the order.
   */
  quantity: number;
  metadata?: unknown;
  calculatedDiscounts?: unknown;
  unitGrossPrice?: number;
  sumGrossPrice?: number;
  taxRate?: string;
  unitNetPrice?: number;
  sumNetPrice?: number;
  /**
   * Single price of the product.
   */
  unitPrice: number;
  unitTaxAmountFullAggregation?: number;
  sumTaxAmountFullAggregation?: number;
  refundableAmount?: number;
  canceledAmount?: number;
  sumSubtotalAggregation?: number;
  unitSubtotalAggregation?: number;
  unitProductOptionPriceAggregation?: number;
  sumProductOptionPriceAggregation?: number;
  unitExpensePriceAggregation?: number;
  sumExpensePriceAggregation?: number;
  unitDiscountAmountAggregation?: number;
  sumDiscountAmountAggregation?: number;
  unitDiscountAmountFullAggregation?: number;
  sumDiscountAmountFullAggregation?: number;
  unitPriceToPayAggregation?: number;
  sumPriceToPayAggregation?: number;
  taxRateAverageAggregation?: string;
  taxAmountAfterCancellation?: number;
  orderReference?: string | null;
  uuid?: string;
  isReturnable?: boolean;
  idShipment?: number;
  bundleItemIdentifier?: string;
  relatedBundleItemIdentifier?: string;
  productOptions: ProductOption[];
}

export interface Expense {
  type: string;
  name: string;
  sumPrice: number;
  unitGrossPrice: number;
  sumGrossPrice: number;
  taxRate: string;
  unitNetPrice: number;
  sumNetPrice: number;
  canceledAmount?: number;
  unitDiscountAmountAggregation?: number;
  sumDiscountAmountAggregation?: number;
  unitTaxAmount: number;
  sumTaxAmount: number;
  unitPriceToPayAggregation: number;
  sumPriceToPayAggregation: number;
  taxAmountAfterCancellation?: number;
  idShipment: number;
  idSalesExpense: number;
}

export const orderStorageKey = 'order.storageKey';

export interface OrderData {
  createdAt: string;
  id: string;
  totals: OrderTotals;
  currencyIsoCode: string;
  items: OrderItem[];
  expenses: Expense[];
  billingAddress?: Address;
  shippingAddress?: Address;
  priceMode: PriceMode;
  payments: OrderPayment[];
  shipments: OrderShipment[];
  calculatedDiscounts?: Record<string, OrderDiscount>;
  bundleItems?: unknown[];
  userId: string;
}

export interface OrderDiscount {
  description?: string;
  displayName: string;
  quantity: number;
  sumAmount: number;
  unitAmount?: number | null;
  voucherCode?: string | null;
}

export interface OrderResponse {
  orderReference: string;
  id?: string | null;
  orders: OrderData[];
}
