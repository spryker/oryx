import { CamelCase } from '@spryker-oryx/typescript-utils';
import { ApiModel } from '../../../models';
import { GlueImageSets } from './images';
import { GlueProductPrices } from './price';

export interface RELATIONSHIP {
  id: string;
  type: string;
}

export interface INCLUDE<T, A> {
  type: T;
  id: string;
  attributes: A;
}

export interface JSON_API_MODEL<T, A> {
  data: {
    attributes: T;
    relationships?: Record<string, Record<'data', RELATIONSHIP[]>>;
  };
  included?: A;
}

export type ProductIncludes =
  | INCLUDE<ApiModel.INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS, GlueImageSets>
  | INCLUDE<ApiModel.INCLUDES.CONCRETE_PRODUCT_PRICES, GlueProductPrices>;

export type GlueProduct = JSON_API_MODEL<ApiModel.Product, ProductIncludes[]>;

type DeserializedIncludes = {
  [P in ApiModel.INCLUDES as `${CamelCase<P>}`]?: P extends ApiModel.INCLUDES.CONCRETE_PRODUCT_IMAGE_SETS
    ? GlueImageSets[]
    : P extends ApiModel.INCLUDES.CONCRETE_PRODUCT_PRICES
    ? GlueProductPrices[]
    : unknown;
};

export type DeserializedProduct = ApiModel.Product & DeserializedIncludes;
