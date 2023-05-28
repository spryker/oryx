import { resolve } from '@spryker-oryx/di';
import {
  ContentMixin,
  defaultOptions,
  LayoutMixin,
} from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { FacetListService } from '@spryker-oryx/search';
import { FacetSelect } from '@spryker-oryx/search/facet';
import { hydratable, signal } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import { take, tap } from 'rxjs/operators';
import { FacetComponentRegistryService } from '../../src/renderers';
import { FacetsOptions } from './facet-navigation.model';
import { facetNavigation } from './facet-navigation.styles';

@hydratable(['mouseover', 'focusin'])
@defaultOptions({
  expandedItemsCount: 2,
  valueRenderLimit: 5,
  minForSearch: 13,
  exclusions: ['rating', 'price'],
})
export class SearchFacetNavigationComponent extends LayoutMixin(
  ContentMixin<FacetsOptions>(LitElement)
) {
  static styles = [facetNavigation];

  protected facetListService = resolve(FacetListService);
  protected facetRenderer = resolve(FacetComponentRegistryService);
  protected routerService = resolve(RouterService);

  protected facets = signal(this.facetListService.get());

  protected override render(): TemplateResult | void {
    const {
      exclusions,
      valueRenderLimit: renderLimit = Infinity,
      expandedItemsCount = 0,
      minForSearch = Infinity,
    } = this.$options();

    const facets = this.facets()?.filter(
      (facet) => !exclusions?.includes(facet.parameter)
    );

    if (!facets) return;

    return html`${facets.map((facet, index) =>
      this.facetRenderer.renderFacetComponent(
        facet,
        {
          renderLimit,
          open: index < expandedItemsCount,
          minForSearch,
          enableClearAction: !(
            this.routerService.getPathId('category') &&
            facet.parameter === 'category'
          ),
        },
        this.applyFilters.bind(this)
      )
    )}
    ${unsafeHTML(`<style>${this.layoutStyles()}</style>`)} `;
  }

  protected applyFilters(e: CustomEvent<FacetSelect>): void {
    const { name, value: selectedFacetValue } = e.detail;

    this.facetListService
      .get()
      .pipe(take(1))
      .subscribe((facets) => {
        const facet = facets?.find((facet) => facet.name === name);
        if (!facet) return;
        if (!selectedFacetValue) {
          this.facetNavigation(facet.parameter, []);
          return;
        }

        const values = facet.multiValued
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
          : [selectedFacetValue.value];

        this.facetNavigation(facet.parameter, values as string[]);
      });
  }

  protected facetNavigation(parameter: string, values: string[]): void {
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
