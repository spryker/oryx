export interface CartQualifier {
  cartId?: string;
}

export interface CartEntryQualifier extends CartQualifier {
  groupKey?: string;
}

export interface AddCartEntryQualifier extends CartQualifier {
  sku: string;
  quantity?: number;
}

export interface CouponQualifier extends CartQualifier {
  code: string;
}

export interface UpdateCartEntryQualifier extends CartEntryQualifier {
  quantity: number;
}

export interface UpdateCartQualifier extends CartEntryQualifier {
  priceMode?: string;
  version?: string;
}
