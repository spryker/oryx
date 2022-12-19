import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/injector';
import { combineLatest, map, Observable } from 'rxjs';
import { ProductList } from '../../../../models';
import { ApiProductListModel } from '../../../../models/product-list.api.model';
import { ConcreteProductsNormalizer } from '../concrete-products';
import { FacetNormalizer } from '../facet';
import { FacetCategoryNormalizer } from '../facet-category';
import { FacetRangeNormalizer } from '../facet-range';
import { DeserializedProductListIncludes } from '../model';
import { DeserializedProductList } from './model';

export const ProductListNormalizer = 'FES.ProductListNormalizer*';

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

export function productFacetNormalizer(
  data: [DeserializedProductList],
  transformer: TransformerService
): Observable<Partial<ProductList>> {
  const categoryFacet = data[0].valueFacets!.splice(
    data[0].valueFacets!.findIndex((v) => v.name === 'category'),
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
    transformer.transform(data[0].valueFacets, FacetNormalizer),
    transformer.transform(data[0].rangeFacets, FacetRangeNormalizer),
  ]).pipe(
    map(([categoryFacet, facetValues, rangeValues]) => {
      return { facets: [categoryFacet, ...facetValues, ...rangeValues] };
    })
  );
}

export const productListNormalizer: Provider[] = [
  {
    provide: ProductListNormalizer,
    useValue: concreteProductNormalizer,
  },
  {
    provide: ProductListNormalizer,
    useValue: productFacetNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ProductListNormalizer]: Transformer<ProductList>[];
  }
}
