import { Transformer } from '@spryker-oryx/core';
import { Observable } from 'rxjs';
import {
  DeserializeCategoryIds,
  Facet,
  Pagination,
  Product,
  ProductAvailability,
  ProductLabel,
  ProductList,
  ProductListSort,
  ProductMedia,
  ProductMediaSet,
  ProductPrices,
  ProductQualifier,
  RangeFacet,
} from '../../models';

export interface ProductAdapter {
  getKey(qualifier: ProductQualifier): string;
  get(qualifier: ProductQualifier): Observable<Product>;
}

export const ProductAdapter = 'oryx.ProductAdapter';

export const AvailabilityNormalizer = 'oryx.AvailabilityNormalizer*';
export const CategoryIdNormalizer = 'oryx.CategoryIdNormalizer*';
export const ConcreteProductsNormalizer = 'oryx.ConcreteProductsNormalizer*';
export const FacetNormalizer = 'oryx.FacetNormalizer*';
export const FacetCategoryNormalizer = 'oryx.FacetCategoryNormalizer*';
export const FacetRangeNormalizer = 'oryx.FacetRangeNormalizer*';
export const FacetRatingNormalizer = 'oryx.FacetRatingNormalizer*';
export const ProductLabelsNormalizer = 'oryx.ProductLabelsNormalizer*';
export const ProductMediaNormalizer = 'oryx.ProductMediaNormalizer*';
export const ProductMediaSetNormalizer = 'oryx.ProductMediaSetNormalizer*';
export const PaginationNormalizer = 'oryx.PaginationNormalizer*';
export const PriceNormalizer = 'oryx.PriceNormalizer*';
export const ProductNormalizer = 'oryx.ProductNormalizer*';
export const ProductListNormalizer = 'oryx.ProductListNormalizer*';
export const RelationsListNormalizer = 'oryx.RelationsListNormalizer*';
export const SortNormalizer = 'oryx.SortNormalizer*';

declare global {
  interface InjectionTokensContractMap {
    [ProductAdapter]: ProductAdapter;

    [AvailabilityNormalizer]: Transformer<ProductAvailability>[];
    [CategoryIdNormalizer]: Transformer<DeserializeCategoryIds>[];
    [ConcreteProductsNormalizer]: Transformer<Product[]>[];
    [FacetNormalizer]: Transformer<Facet[]>[];
    [FacetCategoryNormalizer]: Transformer<Facet>[];
    [FacetRangeNormalizer]: Transformer<RangeFacet[]>[];
    [FacetRatingNormalizer]: Transformer<Facet>[];
    [ProductLabelsNormalizer]: Transformer<ProductLabel[]>[];
    [ProductMediaNormalizer]: Transformer<ProductMedia>[];
    [ProductMediaSetNormalizer]: Transformer<ProductMediaSet[]>[];
    [PaginationNormalizer]: Transformer<Pagination>[];
    [PriceNormalizer]: Transformer<ProductPrices>[];
    [ProductNormalizer]: Transformer<Product>[];
    [ProductListNormalizer]: Transformer<ProductList>[];
    [RelationsListNormalizer]: Transformer<Product[]>[];
    [SortNormalizer]: Transformer<ProductListSort>[];
  }
}
