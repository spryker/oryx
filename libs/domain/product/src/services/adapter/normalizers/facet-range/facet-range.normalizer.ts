import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, FacetType, RangeFacet } from '../../../../models';

export const FacetRangeNormalizer = 'oryx.FacetRangeNormalizer*';

export function facetsRangeNormalizer(
  rangeFacets: ApiProductListModel.RangeFacet[]
): RangeFacet[] {
  return rangeFacets.reduce((normalizedFacetList: RangeFacet[], facet) => {
    //ignore the facet if difference between min and max is 1
    if (facet.max - facet.min <= 1) return normalizedFacetList;

    const { config, localizedName } = facet;

    const values = {
      min: facet.min,
      max: facet.max,
      selected: {
        max: facet.activeMax,
        min: facet.activeMin,
      },
    };

    const normalizedFacet: RangeFacet = {
      type: FacetType.Range,
      name: localizedName,
      parameter: config.parameterName,
      values,
    };

    return [...normalizedFacetList, normalizedFacet];
  }, []);
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRangeNormalizer]: Transformer<RangeFacet[]>[];
  }
}
