import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/di';
import { Observable, combineLatest, map, of } from 'rxjs';
import { ApiProductListModel, Facet, ProductList } from '../../../../models';
import { ConcreteProductsNormalizer } from '../concrete-products';
import { FacetNormalizer } from '../facet';
import { FacetCategoryNormalizer } from '../facet-category';
import { FacetRangeNormalizer } from '../facet-range';
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
  const { rangeFacets, categoryTreeFilter, valueFacets, pagination } = data[0];

  const categoryFacet = valueFacets!.splice(
    valueFacets!.findIndex((v) => v.name === 'category'),
    1
  );

  return combineLatest([
    transformer.transform(
      {
        categoryFacet: categoryFacet[0],
        categoryTreeFilter,
      },
      FacetCategoryNormalizer
    ),
    transformer.transform(
      {
        facetList: valueFacets,
        numFound: pagination?.numFound,
      },
      FacetNormalizer
    ),
    transformer.transform(rangeFacets, FacetRangeNormalizer),
  ]).pipe(
    map((facets) => {
      return {
        facets: facets.filter((facet) => facet).flat() as Facet[],
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
