import {
  ComponentMixin,
  ContentController,
  RouterService,
} from '@spryker-oryx/experience';
import { layoutStyles } from '@spryker-oryx/experience/composition';
import { resolve } from '@spryker-oryx/injector';
import { Facet } from '@spryker-oryx/product';
import { FacetSelect } from '@spryker-oryx/search/facet';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { combineLatest, map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { FacetComponentRegistryService } from '../../src/renderers';
import { FacetListService } from '../../src/services/facet-list.service';
import { FacetsOptions } from './facet-navigation.model';
import { facetNavigation } from './facet-navigation.styles';

export class SearchFacetNavigationComponent extends ComponentMixin<FacetsOptions>() {
  static styles = [layoutStyles, facetNavigation];

  private defaultOptions: FacetsOptions = {
    valueRenderLimit: 5,
    expandedItemsCount: 5,
  };

  protected options$ = new ContentController(this)
    .getOptions()
    .pipe(map((options) => ({ ...this.defaultOptions, ...options })));
  protected facetListService = resolve(FacetListService);
  protected routerService = resolve(RouterService);
  protected facetRenderer = resolve(FacetComponentRegistryService);

  protected facets$ = combineLatest([
    this.facetListService.get(),
    this.options$,
  ]);

  protected applyFilters(e: CustomEvent<FacetSelect>): void {
    this.routerService
      .getUrl('', {
        queryParams: {
          [e.detail.parameter.toLowerCase()]: e.detail.values as string[],
        },
        queryParamsHandling: 'merge',
      })
      .pipe(tap((url) => this.routerService.navigate(url)))
      .subscribe();
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.facets$, ([facets, options]) => {
        return this.renderFacets(facets, options);
      })}
    `;
  }

  protected renderFacets(
    facets: Facet[] | null,
    options: FacetsOptions
  ): TemplateResult {
    return html`${(facets ?? []).map((facet, index) => {
      return this.facetRenderer.renderFacetComponent(
        facet,
        {
          renderLimit: options.valueRenderLimit!,
          open: index < (options.expandedItemsCount ?? 0),
        },
        this.applyFilters.bind(this)
      );
    })}`;
  }
}
