import { resolve } from '@spryker-oryx/di';
import {
  ContentMixin,
  defaultOptions,
  LayoutMixin,
} from '@spryker-oryx/experience';
import { FacetType, RangeFacet } from '@spryker-oryx/product';
import { RouterService } from '@spryker-oryx/router';
import {
  FacetComponentRegistryService,
  FacetListService,
  SelectFacetEventDetail,
  SelectFacetValue,
  SelectRangeFacetValue,
  SelectRangeFacetValues,
} from '@spryker-oryx/search';
import {
  computed,
  featureVersion,
  hydrate,
  signal,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { tap } from 'rxjs/operators';
import { SearchFacetNavigationOptions } from './facet-navigation.model';
import { searchFacetNavigationStyles } from './facet-navigation.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
@defaultOptions({
  expandedItemsCount: 5,
  valueRenderLimit: 5,
  minForSearch: 13,
  bury: [{ facets: featureVersion < '1.2' ? ['price', 'rating'] : [] }],
})
export class SearchFacetNavigationComponent extends LayoutMixin(
  ContentMixin<SearchFacetNavigationOptions>(LitElement)
) {
  static styles = [searchFacetNavigationStyles];

  protected facetListService = resolve(FacetListService);
  protected facetComponentRegistryService = resolve(
    FacetComponentRegistryService
  );
  protected routerService = resolve(RouterService);

  protected $facets = signal(this.facetListService.get());
  protected filteredFacets = computed(() => {
    const { bury } = this.$options();

    return this.$facets()?.filter(
      (facet) => !bury?.find((b) => b.facets.includes(facet.parameter))
    );
  });

  protected override render(): TemplateResult | void {
    const facets = this.filteredFacets();

    if (!facets?.length) return;

    const {
      valueRenderLimit: renderLimit = Infinity,
      expandedItemsCount = 0,
      minForSearch = Infinity,
    } = this.$options();

    return html`
      ${repeat(
        facets,
        ({ name }) => name,
        (facet, index) =>
          this.facetComponentRegistryService.renderFacetComponent(
            facet,
            {
              renderLimit,
              open: index < expandedItemsCount,
              minForSearch,
              enableClear: !(
                this.routerService.getPathId('category') &&
                facet.parameter === 'category'
              ),
            },
            this.applyFilters.bind(this)
          )
      )}
      ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)}
    `;
  }

  protected applyFilters(e: CustomEvent<SelectFacetEventDetail>): void {
    const { name, value } = e.detail;

    const facet = this.$facets()?.find((facet) => facet.name === name);

    if (!facet) return;

    if (facet.type !== FacetType.Range) {
      const selectedFacetValue = value as SelectFacetValue;
      const values = selectedFacetValue
        ? facet.type === FacetType.Multi
          ? [
              ...(facet.selectedValues ?? []),
              ...(selectedFacetValue.selected
                ? [selectedFacetValue.value]
                : []),
            ].filter(
              (selectedValue) =>
                selectedFacetValue.selected ||
                selectedValue !== selectedFacetValue.value
            )
          : [selectedFacetValue.value]
        : [];
      const stringifiedValues = values.map((value) => value.toString());

      this.navigate(facet.parameter, stringifiedValues);
    } else {
      const selectedFacetValue = value as SelectRangeFacetValue;
      this.navigateRange(facet, selectedFacetValue?.selected);
    }
  }

  protected navigate(parameter: string, values: string[] = []): void {
    const pathId = this.routerService.getPathId(parameter);

    this.routerService
      .getUrl(`${pathId ? `/${parameter}/${values[0]}` : ''}`, {
        queryParams: pathId
          ? undefined
          : {
              [parameter.toLowerCase()]: values,
            },
        queryParamsHandling: 'merge',
        ignoreQueryParams: ['page'],
      })
      .pipe(tap((url) => this.routerService.navigate(url)))
      .subscribe();
  }

  protected navigateRange(
    facet: RangeFacet,
    selectedValues?: SelectRangeFacetValues
  ): void {
    const rangeParams = ['min', 'max'] as (keyof SelectRangeFacetValues)[];
    const queryParams = rangeParams.reduce((acc, key) => {
      const selected = selectedValues?.[key];
      const facetValue = facet.values?.[key];
      return {
        ...acc,
        [`${facet.parameter}[${key}]`]:
          (selected !== facetValue ? selected : undefined) ?? '',
      };
    }, {});

    this.routerService
      .getUrl('', {
        queryParams,
        queryParamsHandling: 'merge',
        ignoreQueryParams: ['page'],
      })
      .pipe(tap((url) => this.routerService.navigate(url)))
      .subscribe();
  }
}
