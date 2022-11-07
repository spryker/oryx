import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import {
  ConcreteProductsNormalizers,
  DeserializedProductListIncludes,
  Facet,
  FacetValue,
  ProductList,
} from '@spryker-oryx/product';
import { map, Observable, of } from 'rxjs';
import { ApiProductListModel } from '../../../../models/product-list.api.model';
import { DeserializedProductList } from './model';

export const ProductListNormalizers = 'FES.ProductListNormalizers';

export function productNormalizer(
  data: DeserializedProductListIncludes[],
  transformer: TransformerService
): Observable<Partial<ProductList>> {
  const abstractKey = camelize(ApiProductListModel.Includes.AbstractProducts);
  const { [abstractKey]: products } = data[0];

  return transformer
    .transform(products, ConcreteProductsNormalizers)
    .pipe(map((products) => ({ products })));
}

export function productFacetsNormalizer(
  data: [DeserializedProductList]
): Observable<Partial<ProductList>> {
  const normalize = (
    facetList: (
      | ApiProductListModel.ValueFacet
      | ApiProductListModel.RangeFacet
    )[]
  ): Facet[] => {
    return facetList.map((facet) => {
      const { config, localizedName } = facet;

      const facetValue = Object.prototype.hasOwnProperty.call(facet, 'values')
        ? (facet as unknown as ApiProductListModel.ValueFacet).values
        : (() => {
            const rangeFacet =
              facet as unknown as ApiProductListModel.RangeFacet;
            return {
              min: rangeFacet.min,
              max: rangeFacet.max,
              selected: {
                max: rangeFacet.activeMax,
                min: rangeFacet.activeMin,
              },
            };
          })();

      return {
        name: localizedName,
        parameter: config.parameterName,
        count: facet.docCount,
        values: Array.isArray(facetValue)
          ? facetValue.map((value: { value: number; docCount: number }) => {
              return {
                value: value.value,
                selected:
                  (facet as ApiProductListModel.ValueFacet).activeValue ===
                  String(value.value),
                count: value.docCount,
              };
            })
          : facetValue,
      };
    });
  };

  const parseCategoryTree = (
    categoryTree: ApiProductListModel.TreeFacet[],
    valuesList: FacetValue[]
  ): FacetValue[] => {
    return categoryTree.map((treeItem) => ({
      ...valuesList.find((valueList) => valueList.value === treeItem.nodeId)!,
      name: treeItem.name,
      children: treeItem.children?.length
        ? parseCategoryTree(treeItem.children, valuesList)
        : [],
    }));
  };

  const normalizedValueFacets = normalize(data[0].valueFacets!);
  const [categoryFacet] = normalizedValueFacets.splice(
    normalizedValueFacets.findIndex((facet) => facet.parameter === 'category'),
    1
  );
  const { name, parameter, values } = categoryFacet;

  return of({
    facets: [
      {
        name,
        parameter,
        values: parseCategoryTree(
          data[0].categoryTreeFilter!,
          values as FacetValue[]
        ),
      },
      ...normalizedValueFacets,
      ...normalize(data[0].rangeFacets!),
    ],
  });
}

export const productListNormalizers = [
  productNormalizer,
  productFacetsNormalizer,
];

declare global {
  interface InjectionTokensContractMap {
    [ProductListNormalizers]: Transformer<ProductList>[];
  }
}
