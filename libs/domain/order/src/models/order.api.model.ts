import { ApiProductModel } from '@spryker-oryx/glue';
import { ApiAddressModel } from '@spryker-oryx/user';
import { JsonApiModel } from '@spryker-oryx/utilities';

export module ApiOrderModel {
  export enum PriceMode {
    GrossMode = 'GROSS_MODE',
    NetMode = 'NET_MODE',
  }
  export interface Attributes {
    createdAt: string;
    id: string;
    totals: Totals;
    currencyIsoCode: string;
    items: Item[];
    expenses: Expense[];
    billingAddress?: Address;
    shippingAddress?: Address;
    priceMode: PriceMode;
    payments: Payment[];
    shipments: Shipment[];
    calculatedDiscounts?: unknown;
    bundleItems?: unknown[];
  }

  export interface Totals {
    subtotal?: number;
    grandTotal: number;
    expenseTotal?: number;
    discountTotal?: number;
    taxTotal?: number;
    canceledTotal?: number;
    remunerationTotal?: number;
  }

  export interface Item {
    salesOrderConfiguredBundle?: unknown;
    salesOrderConfiguredBundleItem?: unknown;
    name: string;
    sku: string;
    sumPrice: number;
    quantity: number;
    metadata?: unknown;
    calculatedDiscounts?: unknown;
    unitGrossPrice?: number;
    sumGrossPrice?: number;
    taxRate?: string;
    unitNetPrice?: number;
    sumNetPrice?: number;
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
    productOptions: ApiProductModel.ProductOption[];
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

  export interface Payment {
    amount: number;
    paymentProvider: string;
    paymentMethod: string;
  }

  export interface Shipment {
    shipmentMethodName: string;
    carrierName: string;
    deliveryTime?: number;
    defaultGrossPrice: number;
    defaultNetPrice: number;
    currencyIsoCode: string;
  }

  export type Address = Omit<
    ApiAddressModel.Address,
    'isDefaultBilling' | 'isDefaultShipping'
  >;

  export interface OrderPayload {
    type: 'orders';
    attributes: Attributes;
  }

  export type Response = JsonApiModel<Attributes, unknown>;
}
