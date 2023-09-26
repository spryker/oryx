import { Transformer } from '@spryker-oryx/core';
import { ApiProductListModel, FacetType, RangeFacet } from '../../../../models';

export const FacetRangeNormalizer = 'oryx.FacetRangeNormalizer*';

export function facetsRangeNormalizer(
  rangeFacets: ApiProductListModel.RangeFacet[]
): RangeFacet[] {
  return rangeFacets.reduce((normalizedFacetList: RangeFacet[], facet) => {
    const { config, localizedName } = facet;

    const values = {
      min: facet.min,
      max: facet.max,
      selected: {
        max: facet.activeMax,
        min: facet.activeMin,
      },
    };

    const normalizedFacet = {
      type: FacetType.Range,
      name: localizedName,
      parameter: config.parameterName,
      values,
    } as RangeFacet;

    return [...normalizedFacetList, normalizedFacet];
  }, []);
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRangeNormalizer]: Transformer<RangeFacet[]>[];
  }
}
