import { Product } from '../../../../../domain/product/src/models/product.model';

export module ApiProductListModel {
  export interface ProductList {
    abstractProducts: Product[];
    valueFacets: ValueFacet[];
    rangeFacets: RangeFacet[];
    categoryTreeFilter: TreeFacet[];
    pagination: Pagination;
  }

  export interface TreeFacet {
    nodeId: number;
    name: string;
    docCount: number;
    children?: TreeFacet[];
  }

  export interface ValueFacet {
    activeValue: string | string[] | null;
    config: FacetConfig;
    docCount: number | null;
    localizedName: string;
    name: string;
    values: { value: number | string; docCount: number }[];
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
    Pagination = 'pagination',
    Sort = 'sort',
  }

  export interface Pagination {
    numFound: number;
    currentPage: number;
    maxPage: number;
    currentItemsPerPage: number;
    config: PaginationConfig;
  }

  export interface Sort {
    sortParamNames: Array<SortParamOptions>;
    sortParamLocalizedNames: { [key in SortParamOptions]?: string };
    currentSortParam: string;
    currentSortOrder: string;
  }

  export interface PaginationConfig {
    parameterName: string;
    itemsPerPageParameterName: string;
    defaultItemsPerPage: number;
    validItemsPerPageOptions: [12, 24, 36];
  }

  export type SortParamOptions =
    | 'rating'
    | 'name_asc'
    | 'name_desc'
    | 'price_asc'
    | 'price_desc'
    | 'popularity';
}
