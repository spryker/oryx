import { Transformer } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { map, take } from 'rxjs';
import { ApiProductListModel, Facet } from '../../../../models';

export const FacetRatingNormalizer = 'oryx.FacetRatingNormalizer*';

export function facetRatingNormalizer(
  ratingFacet: ApiProductListModel.RangeFacet
): Facet {
  const ratingParamKey = 'rating[min]';

  const routerService = resolve(RouterService);

  const selectedValues$ = routerService.currentQuery().pipe(
    map((params) =>
      params?.[ratingParamKey] ? [params?.[ratingParamKey] as string] : []
    ),
    take(1)
  );

  let selectedValues: string[] = [];
  selectedValues$.subscribe((values) => {
    selectedValues = values;
  });

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

  return {
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
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRatingNormalizer]: Transformer<Facet>[];
  }
}
