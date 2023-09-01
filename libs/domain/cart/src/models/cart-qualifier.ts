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

export interface UpdateCartEntryQualifier extends CartEntryQualifier {
  quantity: number;
}

export interface UpdateCartPriceModeQualifier extends CartEntryQualifier {
  priceMode?: string;
}
