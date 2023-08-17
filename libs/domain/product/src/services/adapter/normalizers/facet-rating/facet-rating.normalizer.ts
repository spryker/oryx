import { Transformer } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { ApiProductListModel, Facet } from '../../../../models';

export const FacetRatingNormalizer = 'oryx.FacetRatingNormalizer*';

export function facetRatingNormalizer(
  ratingFacet: ApiProductListModel.RangeFacet
): Observable<Facet> {
  const ratingParamKey = 'rating[min]';

  //TODO: temporary solution. For now, it is only way to get current rating[min] value
  // because the backend wrongly returns the rating[min] value.
  const routerService = resolve(RouterService);

  return routerService.currentQuery().pipe(
    take(1),
    map((params) =>
      params?.[ratingParamKey] ? [params?.[ratingParamKey] as string] : []
    ),
    switchMap((selectedValues) => {
      const facetValues = Array.from(new Array(5).keys())
        .map((i) => {
          const value = i + 1;
          return {
            value: String(value),
            selected: selectedValues.includes(String(value)),
            count: 0,
            disabled: value < ratingFacet.min || value > ratingFacet.max,
          };
        })
        .reverse();

      const { config, localizedName } = ratingFacet;

      const facet: Facet = {
        name: localizedName,
        parameter: ratingParamKey,
        values: facetValues,
        selectedValues,
        valuesTreeLength:
          ratingFacet.max - ratingFacet.min
            ? ratingFacet.max - ratingFacet.min + 1
            : 1,
        ...(config.isMultiValued && { multiValued: config.isMultiValued }),
      };

      return of(facet);
    })
  );
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRatingNormalizer]: Transformer<Facet>[];
  }
}
