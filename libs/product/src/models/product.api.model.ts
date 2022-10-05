import { Include, JsonApiModel } from '@spryker-oryx/typescript-utils';

export module ApiProductModel {
  export interface Attributes {
    attributeNames?: Record<string, string>;
    attributes?: Record<string, string>;
    averageRating?: string;
    description?: string;
    metaDescription?: string;
    metaKeywords?: string;
    metaTitle?: string;
    name?: string;
    reviewCount?: number;
    sku?: string;
    superAttributesDefinition?: string[];
  }

  export interface Concrete extends Attributes {
    discontinuedNote?: string;
    id?: string;
    isDiscontinued?: boolean;
    productAbstractSku?: string;
  }

  export interface Abstract extends Attributes {
    attributeMap?: string[][];
    merchantReference?: string;
    superAttributes?: string[];
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

  export interface ProductLabel {
    id: string;
    name: string;
    isExclusive?: boolean;
    position: number;
    frontEndReference?: string;
  }
  export interface ProductLabels {
    labels?: ProductLabel[];
  }
  export interface ProductOption {
    optionGroupName?: string;
    sku?: string;
    optionName?: string;
    price?: number;
    currencyIsoCode?: string;
  }

  export const enum Includes {
    ConcreteProductImageSets = 'concrete-product-image-sets',
    ConcreteProductPrices = 'concrete-product-prices',
    AbstractProducts = 'abstract-products',
    ConcreteProducts = 'concrete-products',
    Labels = 'product-labels',
  }

  export type ResponseIncludes =
    | Include<Includes.ConcreteProductImageSets, ImageSets>
    | Include<Includes.ConcreteProductPrices, Prices>
    | Include<Includes.Labels, ProductLabels>;

  export type Response = JsonApiModel<Concrete, ResponseIncludes[]>;
}
