import { Include, JsonApiModel } from '@spryker-oryx/typescript-utils';

export module ApiProductModel {
  export interface Attributes {
    attributeNames?: Record<string, unknown>;
    attributes?: Record<string, unknown>;
    averageRating?: string;
    description?: string;
    discontinuedNote?: string;
    id?: string;
    isDiscontinued?: boolean;
    metaDescription?: string;
    metaKeywords?: string;
    metaTitle?: string;
    name?: string;
    productAbstractSku?: string;
    reviewCount?: number;
    sku?: string;
    superAttributesDefinition?: string[];
  }

  export interface Image {
    externalUrlLarge: string;
    externalUrlSmall: string;
  }

  export interface ImageSets {
    imageSets: {
      name: string;
      images: Image[];
    }[];
  }

  export interface Price {
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

  export interface Prices {
    price?: number;
    prices?: Price[];
  }

  export enum Includes {
    ConcreteProductImageSets = 'concrete-product-image-sets',
    ConcreteProductPrices = 'concrete-product-prices',
  }

  export type ResponseIncludes =
    | Include<Includes.ConcreteProductImageSets, ImageSets>
    | Include<Includes.ConcreteProductPrices, Prices>;

  export type Response = JsonApiModel<Attributes, ResponseIncludes[]>;
}
