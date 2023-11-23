import { ApiProductModel } from '@spryker-oryx/product';
import { Include, JsonApiModel } from '@spryker-oryx/utilities';

export module ApiCartModel {
  export enum PriceMode {
    GrossMode = 'GROSS_MODE',
    NetMode = 'NET_MODE',
  }
  export interface Discount {
    displayName: string;
    amount: number;
    code?: string;
  }
  export interface Attributes {
    id: string;
    name: string;
    isDefault: boolean;
    totals: Totals;
    priceMode: PriceMode;
    discounts?: Discount[];
    thresholds?: unknown[];
    currency?: string;
    store?: string;
    version?: string;
    /**
     * Coupons are called `Vouchers` in SCOS. In Oryx, however, we tend to stick to industry names.
     */
    vouchers?: Coupon[];
  }

  export interface Coupon {
    id: string;
    code: string;
    amount: number;
    discountPromotionAbstractSku?: string;
    discountPromotionQuantity?: number;
    discountType: string;
    displayName: string;
    expirationDateTime: Date;
    isExclusive: boolean;
  }

  export interface Totals {
    grandTotal: number;
    priceToPay: number;
    expenseTotal?: number;
    shipmentTotal?: number;
    discountTotal?: number;
    taxTotal?: number;
    subtotal?: number;
  }

  export interface Entry {
    sku: string;
    quantity: number | string;
    groupKey: string;
    abstractSku: string;
    amount?: unknown;
    productOfferReference?: unknown;
    merchantReference?: unknown;
    calculations?: Calculations;
    configuredBundle?: unknown;
    configuredBundleItem?: unknown;
    productConfigurationInstance?: unknown;
    salesUnit?: unknown;
    selectedProductOptions?: ApiProductModel.ProductOption[];
  }

  export interface Calculations {
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

  export enum Includes {
    Items = 'items',
    GuestCartItems = 'guest-cart-items',
    ProductOptions = 'product-options',
    Coupons = 'vouchers',
  }

  export enum UrlParts {
    Customers = 'customers',
    Carts = 'carts',
    Items = 'items',
    GuestCarts = 'guest-carts',
    GuestCartItems = 'guest-cart-items',
    Coupons = 'vouchers',
  }

  export type ResponseIncludes =
    | Include<Includes.Items | Includes.GuestCartItems, Entry>
    | Include<Includes.ProductOptions, ApiProductModel.ProductOption>;

  export type ResponseList = JsonApiModel<
    Attributes,
    ResponseIncludes[],
    Array<unknown>
  >;

  export type Response = JsonApiModel<Attributes, ResponseIncludes[]>;
}
