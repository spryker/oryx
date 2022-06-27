export interface Product {
  sku?: string;
  averageRating?: number;
  reviewCount?: number;
  name?: string;
  description?: string;
  attributes?: Record<string, unknown>;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  price?: ProductPrice;
  images?: ProductImage[];
}

export interface ProductImage {
  externalUrlLarge: string;
  externalUrlSmall: string;
}

export interface ProductPrice {
  defaultPrice?: Price;

  /**
   * Often referred to as the _strikethrough_ or _purchase_ price.
   */
  originalPrice?: Price;
}

export interface Price {
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
