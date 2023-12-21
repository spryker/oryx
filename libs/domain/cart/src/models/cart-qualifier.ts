import { ProductQualifier } from '@spryker-oryx/product';

export interface CartQualifier {
  cartId?: string;
}

export interface CartEntryQualifier extends CartQualifier {
  groupKey?: string;
}

export interface AddCartEntryQualifier extends CartQualifier, ProductQualifier {
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
  store?: string;
  currency: string;
  priceMode: string;
  isDefault?: boolean;
}

export interface UpdateCartQualifier extends CartEntryQualifier, Partial<CreateCartQualifier> {
  version?: string;
}
