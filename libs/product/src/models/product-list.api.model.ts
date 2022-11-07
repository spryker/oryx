import { Product } from '@spryker-oryx/product';

export module ApiProductListModel {
  export interface ProductList {
    abstractProducts: Product[];
    valueFacets: ValueFacet[];
    rangeFacets: RangeFacet[];
    categoryTreeFilter: TreeFacet[];
  }

  export interface TreeFacet {
    nodeId: number;
    name: string;
    docCount: number;
    children?: TreeFacet[];
  }

  export interface ValueFacet {
    activeValue: string | null;
    config: FacetConfig;
    docCount: number | null;
    localizedName: string;
    name: string;
    values: { value: number; docCount: number }[];
  }

  export interface RangeFacet {
    activeMax: number;
    activeMin: number;
    config: FacetConfig;
    docCount: number | null;
    localizedName: string;
    max: number;
    min: number;
    name: string;
  }

  export interface FacetConfig {
    isMultiValued: boolean;
    parameterName: string;
  }

  export const enum Includes {
    AbstractProducts = 'abstract-products',
    ValueFacets = 'value-facets',
    RangeFacets = 'range-facets',
    CategoryTreeFilter = 'category-tree-filter',
  }
}
