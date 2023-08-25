import { Transformer } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map, Observable, take } from 'rxjs';
import { ApiProductListModel, Facet } from '../../../../models';

export const FacetRatingNormalizer = 'oryx.FacetRatingNormalizer*';

export function facetRatingNormalizer(
  ratingFacet: ApiProductListModel.RangeFacet
): Observable<Facet> {
  const ratingParamKey = 'rating[min]';

  //TODO: temporary solution. Should be fixed after https://spryker.atlassian.net/browse/CC-31032.
  // For now, it is only way to get current rating[min] value because the backend wrongly returns the rating[min] value.
  const routerService = resolve(RouterService);

  return routerService.currentQuery().pipe(
    take(1),
    map((params) => {
      const selectedValues = params?.[ratingParamKey]
        ? [params?.[ratingParamKey] as string]
        : [];
      const facetValues = Array.from(new Array(5).keys())
        .reverse()
        .map((i) => {
          const value = i + 1;
          return {
            value: String(value),
            selected: selectedValues.includes(String(value)),
            count: 0,
            disabled: value < ratingFacet.min || value > ratingFacet.max,
          };
        });

      const { config, localizedName } = ratingFacet;

      return {
        name: localizedName,
        parameter: ratingParamKey,
        values: facetValues,
        selectedValues,
        valuesTreeLength: ratingFacet.max
          ? ratingFacet.max - ratingFacet.min + 1
          : 0,
        ...(config.isMultiValued && { multiValued: config.isMultiValued }),
      };
    })
  );
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRatingNormalizer]: Transformer<Facet>[];
  }
}
