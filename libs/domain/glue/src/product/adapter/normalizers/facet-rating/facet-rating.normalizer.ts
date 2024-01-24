import { resolve } from '@spryker-oryx/di';
import { Facet, FacetType } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import { Observable, map, take } from 'rxjs';
import { ApiProductListModel } from '../../../models/product-list.api.model';

//TODO: temporary solution. Should be fixed after https://spryker.atlassian.net/browse/CC-31032.
// For now, it is only way to get current rating value because the backend wrongly returns the rating value.
export function facetRatingNormalizer(
  facet: ApiProductListModel.RangeFacet
): Observable<Facet> {
  return resolve(RouterService)
    .currentQuery()
    .pipe(
      take(1),
      map((params) => {
        const { config, localizedName } = facet;
        const activeMin = params?.['rating[min]'];

        const values = {
          min: 0,
          max: facet.max,
          selected: {
            max: facet.activeMax,
            min: activeMin ? Number(activeMin) : 0,
          },
        };

        return {
          type: FacetType.Range,
          name: localizedName,
          parameter: config.parameterName,
          values,
        };
      })
    );
}
