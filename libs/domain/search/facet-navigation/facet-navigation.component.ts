import { resolve } from '@spryker-oryx/di';
import {
  ContentMixin,
  defaultOptions,
  LayoutMixin,
} from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import {
  FacetComponentRegistryService,
  FacetListService,
} from '@spryker-oryx/search';
import { SelectFacetEventDetail } from '@spryker-oryx/search/facet';
import {
  computed,
  featureVersion,
  hydrate,
  signal,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { tap } from 'rxjs/operators';
import { SearchFacetNavigationOptions } from './facet-navigation.model';
import { searchFacetNavigationStyles } from './facet-navigation.styles';

@hydrate({ event: ['mouseover', 'focusin'] })
@defaultOptions({
  expandedItemsCount: 5,
  valueRenderLimit: 5,
  minForSearch: 13,
  bury: [{ facets: ['price', ...(featureVersion >= '1.2' ? ['rating'] : [])] }],
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

    return html`${facets.map((facet, index) =>
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
    ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)} `;
  }

  protected applyFilters(e: CustomEvent<SelectFacetEventDetail>): void {
    const { name, value: selectedFacetValue } = e.detail;

    const facet = this.$facets()?.find((facet) => facet.name === name);

    if (!facet) return;
    if (!selectedFacetValue) {
      this.navigate(facet.parameter);
      return;
    }

    const values = facet.multiValued
      ? [
          ...(facet.selectedValues ?? []),
          ...(selectedFacetValue.selected ? [selectedFacetValue.value] : []),
        ].filter(
          (selectedValue) =>
            selectedFacetValue.selected ||
            selectedValue !== selectedFacetValue.value
        )
      : [selectedFacetValue.value];

    this.navigate(facet.parameter, values as string[]);
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
}
