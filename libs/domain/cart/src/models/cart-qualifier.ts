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

export interface UpdateCartEntryQualifier extends CartEntryQualifier {
  quantity: number;
}

export interface UpdateCartQualifier extends CartEntryQualifier {
  priceMode?: string;
  version?: string;
}
