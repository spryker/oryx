import { FacetType, RangeFacet } from '@spryker-oryx/product';
import { ApiProductListModel } from '../../../models/product-list.api.model';

export function facetsRangeNormalizer(
  rangeFacets: ApiProductListModel.RangeFacet[]
): RangeFacet[] {
  return rangeFacets.reduce((normalizedFacetList: RangeFacet[], facet) => {
    //ignore the facet if difference between min and max is 1
    if (facet.max - facet.min <= 1) {
      return normalizedFacetList;
    }

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
