import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, Facet } from '../../../../models';

export const FacetRangeNormalizer = 'oryx.FacetRangeNormalizer*';

export function facetsRangeNormalizer(
  rangeFacets: ApiProductListModel.RangeFacet[]
): Facet[] {
  return rangeFacets.reduce((normalizedFacetList: Facet[], facet) => {
    const { config, localizedName } = facet;

    const facetValues = {
      min: facet.min,
      max: facet.max,
      selected: {
        max: facet.activeMax,
        min: facet.activeMin,
      },
    };

    const normalizedFacet = {
      name: localizedName,
      parameter: config.parameterName,
      values: facetValues,
      selectedValue: [],
      ...(config.isMultiValued && { multiValued: config.isMultiValued }),
    };

    return [...normalizedFacetList, normalizedFacet];
  }, []);
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRangeNormalizer]: Transformer<Facet[]>[];
  }
}
