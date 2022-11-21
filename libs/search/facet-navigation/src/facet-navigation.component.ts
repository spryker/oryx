import { ComponentMixin, ContentController } from '@spryker-oryx/experience';
import { layoutStyles } from '@spryker-oryx/experience/composition';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { Facet, FacetValue, RangeFacetValue } from '@spryker-oryx/product';
import { NullableGeneric } from '@spryker-oryx/utilities/typescript';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { FacetListService } from '../../src/services/facet-list.service';
import { FacetsOptions } from './facet-navigation.model';

export class SearchFacetNavigationComponent extends ComponentMixin<FacetsOptions>() {
  static styles = [layoutStyles];

  protected options$ = new ContentController(this).getOptions();
  protected facetListService = resolve(FacetListService);

  protected facets$ = this.facetListService.get();

  protected renderFacets(facets: Facet[]): TemplateResult {
    return html`${facets.map(
      (facet) => html`<div>
        ${facet.name}
        ${Array.isArray(facet.values)
          ? this.renderFacetValues(facet.values)
          : this.renderRangeValue(facet.values)}
      </div>`
    )}`;
  }

  protected renderFacetValues(
    facets: NullableGeneric<FacetValue[]>
  ): TemplateResult {
    return html`
      ${facets?.map(
        (f) =>
          html`<div>${f.name} ${f.count}</div>
            ${when(f.children?.length, () =>
              this.renderFacetValues(f.children!)
            )}`
      )}
    `;
  }

  protected renderRangeValue(rangeFacet: RangeFacetValue): TemplateResult {
    return html` ${rangeFacet.max} ${rangeFacet.max} `;
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.facets$, (facets) => this.renderFacets(facets ?? []))}
    `;
  }
}
