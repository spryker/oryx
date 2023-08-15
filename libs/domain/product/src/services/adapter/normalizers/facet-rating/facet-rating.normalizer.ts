import { Transformer } from '@spryker-oryx/core';
import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import { FacetParams } from '@spryker-oryx/search';
import { tap } from 'rxjs';
import { ApiProductListModel, Facet } from '../../../../models';

export const FacetRatingNormalizer = 'oryx.FacetRatingNormalizer*';

export function facetRatingNormalizer(
  ratingFacet: ApiProductListModel.RangeFacet
): Facet {
  const routerService = resolve(RouterService);

  let selectedValues: string[] = [];
  routerService
    .currentQuery()
    .pipe(
      tap((params) => {
        selectedValues = params?.[FacetParams.Rating]
          ? [params?.[FacetParams.Rating] as string]
          : [];
      })
    )
    .subscribe().unsubscribe();

  const facetValues = [];

  for (let i = ratingFacet.min; i <= ratingFacet.max; i++) {
    facetValues.unshift({
      value: String(i),
      selected: selectedValues.includes(String(i)),
      count: 0,
    });
  }

  const { config, localizedName } = ratingFacet;

  return {
    name: localizedName,
    parameter: FacetParams.Rating,
    values: facetValues,
    selectedValues,
    valuesTreeLength:
      ratingFacet.max - ratingFacet.min
        ? ratingFacet.max - ratingFacet.min + 1
        : ratingFacet.max ?? 1,
    ...(config.isMultiValued && { multiValued: config.isMultiValued }),
  };
}

declare global {
  interface InjectionTokensContractMap {
    [FacetRatingNormalizer]: Transformer<Facet>[];
  }
}
