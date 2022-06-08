export interface ProductImage {
  externalUrlLarge: string;
  externalUrlSmall: string;
}

export interface ProductPrice {
  priceTypeName: 'DEFAULT' | 'ORIGINAL';
  netAmount: number | null;
  grossAmount: number | null;
  currency: {
    code: string;
    name: string;
    symbol: string;
  };
  volumePrices: unknown[];
}

export interface Product {
  sku?: string;
  averageRating?: string;
  reviewCount?: number;
  name?: string;
  description?: string;
  truncateAfter?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  images?: ProductImage[];
  price?: number;
  prices?: ProductPrice[];
}
