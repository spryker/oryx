import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/di';
import { Observable, combineLatest, map } from 'rxjs';
import { ApiProductListModel, ProductList } from '../../../../models';
import { ConcreteProductsNormalizer } from '../concrete-products';
import { FacetNormalizer } from '../facet';
import { FacetCategoryNormalizer } from '../facet-category';
import { FacetRangeNormalizer } from '../facet-range';
import { FacetRatingNormalizer } from '../facet-rating';
import { DeserializedProductListIncludes } from '../model';
import { PaginationNormalizer } from '../pagination';
import { SortNormalizer } from '../sort';
import { DeserializedProductList } from './model';

export const ProductListNormalizer = 'oryx.ProductListNormalizer*';

export function paginationNormalizer(
  data: [DeserializedProductList],
  transformer: TransformerService
): Observable<Partial<ProductList>> {
  const abstractKey = camelize(ApiProductListModel.Includes.Pagination);
  const { [abstractKey]: pagination } = data[0];

  return transformer
    .transform(pagination, PaginationNormalizer)
    .pipe(map((pagination) => ({ pagination })));
}

export function concreteProductNormalizer(
  data: DeserializedProductListIncludes[],
  transformer: TransformerService
): Observable<Partial<ProductList>> {
  const abstractKey = camelize(ApiProductListModel.Includes.AbstractProducts);
  const { [abstractKey]: products } = data[0];

  return transformer
    .transform(products, ConcreteProductsNormalizer)
    .pipe(map((products) => ({ products })));
}

export function sortingNormalizer(
  data: [DeserializedProductList],
  transformer: TransformerService
): Observable<Partial<ProductList>> {
  const abstractKey = camelize(ApiProductListModel.Includes.Sort);
  const { [abstractKey]: sort } = data[0];

  return transformer
    .transform(sort, SortNormalizer)
    .pipe(map((sort) => ({ sort })));
}

export function productFacetNormalizer(
  data: [DeserializedProductList],
  transformer: TransformerService
): Observable<Partial<ProductList>> {
  const categoryFacet = data[0].valueFacets!.splice(
    data[0].valueFacets!.findIndex((v) => v.name === 'category'),
    1
  );

  const ratingFacet = data[0].rangeFacets!.splice(
    data[0].valueFacets!.findIndex((v) => v.name === 'rating'),
    1
  );

  return combineLatest([
    transformer.transform(
      {
        categoryFacet: categoryFacet[0],
        categoryTreeFilter: data[0].categoryTreeFilter,
      },
      FacetCategoryNormalizer
    ),
    transformer.transform(ratingFacet[0], FacetRatingNormalizer),
    transformer.transform(
      {
        facetList: data[0].valueFacets,
        numFound: data[0].pagination?.numFound,
      },
      FacetNormalizer
    ),
    transformer.transform(data[0].rangeFacets, FacetRangeNormalizer),
  ]).pipe(
    map(([categoryFacet, ratingFacet, facetValues, rangeValues]) => {
      return {
        facets: [categoryFacet, ratingFacet, ...facetValues, ...rangeValues],
      };
    })
  );
}

export const productListNormalizer: Provider[] = [
  {
    provide: ProductListNormalizer,
    useValue: paginationNormalizer,
  },
  {
    provide: ProductListNormalizer,
    useValue: concreteProductNormalizer,
  },
  {
    provide: ProductListNormalizer,
    useValue: productFacetNormalizer,
  },
  {
    provide: ProductListNormalizer,
    useValue: sortingNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ProductListNormalizer]: Transformer<ProductList>[];
  }
}
