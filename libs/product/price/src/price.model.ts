import { ProductPrices } from '@spryker-oryx/product';

export interface ProductPriceOptions {
  showOriginal: boolean;
}

export interface FormattedProductPrice {
  defaultPrice?: FormattedPrice;
  originalPrice?: FormattedPrice;
}

export interface FormattedPrice extends ProductPrices {
  /** Formatted price based on currency and localisation.
   *
   * I.e. `€ 5,95` vs `5.95 €`.
   */
  formattedPrice?: string;
}
