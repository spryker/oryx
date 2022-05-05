export interface ProductImage {
  externalUrlLarge: string;
  externalUrlSmall: string;
}

export interface Product {
  sku?: string;
  averageRating?: string;
  reviewCount?: number;
  name?: string;
  description?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes?: Record<string, any>;
  metaTitle?: string;
  metaKeywords?: string;
  metaDescription?: string;
  images?: ProductImage[];
}
