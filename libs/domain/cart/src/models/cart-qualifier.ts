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

export interface CreateCartQualifier {
  name?: string;
}

export interface UpdateCartQualifier extends CartEntryQualifier {
  name?: string;
  priceMode?: string;
  version?: string;
  isDefault?: true;
}
