export interface Product {
  sku?: string;
  attributeNames?: Record<string, string>;
  attributes?: Record<string, string>;
  averageRating?: number;
  reviewCount?: number;
  name?: string;
  description?: string;
  price?: ProductPrices;
  images?: ProductImage[];
}

export interface ProductImage {
  externalUrlLarge: string;
  externalUrlSmall: string;
}

export interface ProductPrices {
  defaultPrice?: ProductPrice;

  /**
   * Often referred to as the _strikethrough_ or _purchase_ price.
   */
  originalPrice?: ProductPrice;
}

export interface ProductPrice {
  /**
   * The price value either is the gross or net value, depending on
   * the isNet flag.
   */
  value: number;

  /** The currency code  */
  currency: string;

  /** Indicates whether the price is net or gross */
  isNet: boolean;
}

export interface ProductOption {
  optionGroupName?: string;
  sku?: string;
  optionName?: string;
  price?: number;
}
