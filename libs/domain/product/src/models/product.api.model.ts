import { Include, JsonApiModel } from '@spryker-oryx/utilities';

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
    imageSets: ImageSet[];
  }
  export interface ImageSet {
    name: string;
    images: Image[];
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

  export interface ProductAvailability {
    isNeverOutOfStock: boolean;
    availability: boolean;
    quantity: string;
  }

  export interface ProductOffer {
    id: string;
    merchantReference: string;
    price?: number;
    merchants: Merchant[];
    productOfferPrices: ProductOfferPrice[];
  }

  export interface ProductOfferPrice {
    id: string;
    price: number;
    prices: Price[];
  }

  export interface CategoryNodes {
    id: string;
    isActive: boolean;
    metaDescription: string;
    metaKeywords: string;
    metaTitle: string;
    name: string;
    nodeId: number;
    order: number;
    parents: CategoryNodes[];
    children: CategoryNodes[];
  }

  export interface Merchant {
    id: string;
    merchantName: string;
    merchantUrl: string;
  }

  export interface ProductOffer {
    id: string;
  }

  export interface ProductOfferPrice {
    id: string;
  }

  export const enum Includes {
    ConcreteProductImageSets = 'concrete-product-image-sets',
    ConcreteProductPrices = 'concrete-product-prices',
    AbstractProducts = 'abstract-products',
    ConcreteProducts = 'concrete-products',
    Labels = 'product-labels',
    ConcreteProductAvailabilities = 'concrete-product-availabilities',
    CategoryNodes = 'category-nodes',
    ProductOffers = 'product-offers',
    ProductOfferPrices = 'product-offer-prices',
    ProductOfferAvailabilities = 'product-offer-availabilities',
    Merchants = 'merchants',
  }

  export const enum CategoryNodeFields {
    NodeId = 'nodeId',
    Name = 'name',
    Order = 'order',
    MetaDescription = 'metaDescription',
    Parents = 'parents',
    Children = 'children',
    IsActive = 'isActive',
  }

  export type ResponseIncludes =
    | Include<Includes.ConcreteProductImageSets, ImageSets>
    | Include<Includes.ConcreteProductPrices, Prices>
    | Include<Includes.ConcreteProductAvailabilities, ProductAvailability>
    | Include<Includes.Labels, ProductLabels>
    | Include<Includes.AbstractProducts, Abstract>
    | Include<Includes.CategoryNodes, CategoryNodes>
    | Include<Includes.ProductOffers, ProductOffer>
    | Include<Includes.ProductOfferPrices, ProductOfferPrice>
    | Include<Includes.ProductOfferAvailabilities, ProductAvailability>
    | Include<Includes.Merchants, Merchant>;

  export type Response = JsonApiModel<Concrete, ResponseIncludes[]>;
}
