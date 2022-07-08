export module ApiModel {
  export interface Product {
    sku?: string;
    averageRating?: string;
    reviewCount?: number;
    name?: string;
    description?: string;
    attributes?: Record<string, unknown>;
    metaTitle?: string;
    metaKeywords?: string;
    metaDescription?: string;
    images?: ProductImage[];
    price?: number;
    prices?: ProductPrice[];
  }

  export interface ProductImage {
    externalUrlLarge: string;
    externalUrlSmall: string;
  }

  export interface ProductPrice {
    priceTypeName: 'DEFAULT' | 'ORIGINAL';
    netAmount?: number;
    grossAmount?: number;
    currency: {
      code: string;
      name?: string;
      symbol?: string;
    };
    volumePrices?: unknown[];
  }

  export enum INCLUDES {
    CONCRETE_PRODUCT_IMAGE_SETS = 'concrete-product-image-sets',
    CONCRETE_PRODUCT_PRICES = 'concrete-product-prices',
  }
}
