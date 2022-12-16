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

      const facetValues = Object.prototype.hasOwnProperty.call(facet, 'values')
        ? (() =>
            (facet as unknown as ApiProductListModel.ValueFacet).values.reduce(
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
                    (facet as ApiProductListModel.ValueFacet).activeValue
                      ?.split(',')
                      ?.includes(String(value.value)) ?? false,
                  count: value.docCount,
                };

                return [...facetList, parsedFacedValue];
              },
              []
            ))()
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

      const isValuesArray = Array.isArray(facetValues);

      if (isValuesArray ? facetValues.length : facetValues) {
        const normalizedFacet = {
          name: localizedName,
          parameter: config.parameterName,
          values: facetValues,
          ...((facet as ApiProductListModel.ValueFacet).activeValue && {
            selectedValues: (
              facet as ApiProductListModel.ValueFacet
            ).activeValue?.split(','),
          }),
          ...(config.isMultiValued && { multiValued: config.isMultiValued }),
          ...(isValuesArray && {
            valuesTreeLength: facetValues.length,
          }),
        };

        return [...normalizedFacetList, normalizedFacet];
      }

      return normalizedFacetList;
    }, []);
  };

  const parseCategoryTree = (
    category: ApiProductListModel.TreeFacet[],
    values: FacetValue[]
  ): {
    values: FacetValue[];
    valuesTreeLength: number;
  } => {
    let valuesTreeLength = 0;

    const parse = (
      categoryTree: ApiProductListModel.TreeFacet[],
      valuesList: FacetValue[]
    ): FacetValue[] =>
      categoryTree.reduce((treeList: FacetValue[], treeItem) => {
        if (!treeItem.docCount) {
          return treeList;
        }

        valuesTreeLength += 1;

        const parsedTree = {
          ...valuesList.find(
            (valueList) => valueList.value === treeItem.nodeId
          )!,
          name: treeItem.name,
          children: treeItem.children?.length
            ? parse(treeItem.children, valuesList)
            : [],
        };

        return [...treeList, parsedTree];
      }, []);

    const parsedValues = parse(category, values);

    return { values: parsedValues, valuesTreeLength };
  };

  const normalizedValueFacets = normalize(data[0].valueFacets!);
  const [categoryFacet] = normalizedValueFacets.splice(
    normalizedValueFacets.findIndex((facet) => facet.parameter === 'category'),
    1
  );

  return of({
    facets: [
      {
        ...categoryFacet,
        ...parseCategoryTree(
          data[0].categoryTreeFilter!,
          categoryFacet.values as FacetValue[]
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
