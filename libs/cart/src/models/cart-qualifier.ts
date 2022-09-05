export interface CartEntitySalesUnit {
  id: number;
  amount: number;
}

export interface CartEntityProductOption {
  sku: string;
}

export interface CartEntryAttributesQualifier {
  sku: string;
  quantity: number;
  idPromotionalItem?: string;
  salesUnit?: CartEntitySalesUnit;
  productOptions?: CartEntityProductOption[];
  extra?: Record<string, unknown>;
}

export interface CartQualifier {
  cartId?: string;
}

export interface LoadCartsQualifier {
  forceReload?: boolean;
}

export interface AddCartEntryQualifier extends CartEntryAttributesQualifier {
  cartId?: string;
}

export interface UpdateCartEntryQualifier extends CartEntryAttributesQualifier {
  cartId?: string;
  groupKey: string;
}

export interface DeleteCartEntryQualifier {
  cartId?: string;
  groupKey: string;
}
