import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, Facet, FacetValue } from '../../../../models';

export interface FacetNormalizerValue {
  facetList: ApiProductListModel.ValueFacet[];
  numFound?: number;
}

export const FacetNormalizer = 'FES.FacetNormalizer*';

export function facetsNormalizer(
  facetNormalizerValue: FacetNormalizerValue
): Facet[] {
  const { facetList, numFound } = facetNormalizerValue;

  return facetList.reduce((normalizedFacetList: Facet[], facet) => {
    const parsedValue = parseFacetValue(facet, numFound);

    return parsedValue
      ? [...normalizedFacetList, parsedValue]
      : normalizedFacetList;
  }, []);
}

export const parseFacetValue = (
  facet?: ApiProductListModel.ValueFacet,
  numFound?: number
): Facet | null => {
  if (!facet) {
    return null;
  }

  const { config, localizedName } = facet;

  const selectedValue =
    'activeValue' in facet
      ? Array.isArray(facet.activeValue)
        ? facet.activeValue
        : (facet.activeValue as string)?.split(',')
      : [];

  const facetValues = facet.values.reduce(
    (
      facetList: FacetValue[],
      value: { value: number | string; docCount: number }
    ) => {
      const selected =
        (selectedValue ?? []).includes(String(value.value)) ?? false;

      if (!value.docCount || (!selected && value.docCount === numFound)) {
        return facetList;
      }

      const parsedFacedValue = {
        value: value.value,
        selected,
        count: value.docCount,
      };

      return [...facetList, parsedFacedValue];
    },
    []
  );

  return facetValues.length
    ? {
        name: localizedName,
        parameter: config.parameterName,
        values: facetValues,
        selectedValues: selectedValue,
        valuesTreeLength: facetValues.length,
        ...(config.isMultiValued && { multiValued: config.isMultiValued }),
      }
    : null;
};

declare global {
  interface InjectionTokensContractMap {
    [FacetNormalizer]: Transformer<Facet[]>[];
  }
}
