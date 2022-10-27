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
  labels?: ProductLabel[];
  availability?: ProductAvailability;
}

export interface ProductLabel {
  name: string;
  appearance?: ProductLabelAppearance;
}

export const enum ProductLabelAppearance {
  Highlight = 'highlight',
  Info = 'info',
}
export interface ProductList {
  products: Product[];
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

export interface ProductAvailability {
  isNeverOutOfStock: boolean;
  availability: boolean;
  quantity: number;
}
