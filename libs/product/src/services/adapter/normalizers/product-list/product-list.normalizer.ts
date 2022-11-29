import { Transformer, TransformerService } from '@spryker-oryx/core';
import { camelize } from '@spryker-oryx/core/utilities';
import { Provider } from '@spryker-oryx/injector';
import { map, Observable, of } from 'rxjs';
import { Facet, FacetValue, ProductList } from '../../../../models';
import { ApiProductListModel } from '../../../../models/product-list.api.model';
import { ConcreteProductsNormalizer } from '../concrete-products';
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

export function productFacetsNormalizer(
  data: [DeserializedProductList]
): Observable<Partial<ProductList>> {
  const normalize = (
    facetList: (
      | ApiProductListModel.ValueFacet
      | ApiProductListModel.RangeFacet
    )[]
  ): Facet[] => {
    return facetList.reduce((normalizedFacetList: Facet[], facet) => {
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

      const facetValues = Array.isArray(facetValue)
        ? facetValue.reduce(
            (
              facetList: FacetValue[],
              value: { value: number; docCount: number }
            ) => {
              if (!value.docCount) {
                return facetList;
              }

              const parsedFacedValue = {
                value: value.value,
                selected:
                  (facet as ApiProductListModel.ValueFacet).activeValue ===
                  String(value.value),
                count: value.docCount,
              };

              return [...facetList, parsedFacedValue];
            },
            []
          )
        : facetValue;

      if (Array.isArray(facetValues) ? facetValues.length : facetValues) {
        const normalizedFacet = {
          name: localizedName,
          parameter: config.parameterName,
          count: facet.docCount,
          values: facetValues,
        };

        return [...normalizedFacetList, normalizedFacet];
      }

      return normalizedFacetList;
    }, []);
  };

  const parseCategoryTree = (
    categoryTree: ApiProductListModel.TreeFacet[],
    valuesList: FacetValue[]
  ): FacetValue[] => {
    return categoryTree.reduce((treeList: FacetValue[], treeItem) => {
      if (!treeItem.docCount) {
        return treeList;
      }

      const parsedTree = {
        ...valuesList.find((valueList) => valueList.value === treeItem.nodeId)!,
        name: treeItem.name,
        children: treeItem.children?.length
          ? parseCategoryTree(treeItem.children, valuesList)
          : [],
      };

      return [...treeList, parsedTree];
    }, []);
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

export const productListNormalizer: Provider[] = [
  {
    provide: ProductListNormalizer,
    useValue: concreteProductNormalizer,
  },
  {
    provide: ProductListNormalizer,
    useValue: productFacetsNormalizer,
  },
];

declare global {
  interface InjectionTokensContractMap {
    [ProductListNormalizer]: Transformer<ProductList>[];
  }
}
