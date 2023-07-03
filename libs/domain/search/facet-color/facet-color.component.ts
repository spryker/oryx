import { resolve } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { FacetColorsMapping } from '@spryker-oryx/search';
import { html, TemplateResult } from 'lit';
// use relative path for dev ssr server, SearchFacetComponent and searchFacetStyles is undefined
import { SearchFacetComponent } from '../facet/facet.component';
import { searchFacetStyles } from '../facet/facet.styles';
import { searchFacetColorStyles } from './facet-color.styles';

export class SearchColorFacetComponent extends SearchFacetComponent {
  static styles = [searchFacetStyles, searchFacetColorStyles];

  protected facetColorsMapping = resolve(FacetColorsMapping);

  protected colors = this.facetColorsMapping.reduce(
    (acc, colors) => ({ ...acc, ...colors }),
    {}
  );

  protected override renderValueControlLabel(
    facetValue: FacetValue
  ): TemplateResult {
    return html`
      <div class="color-facet-label">
        <oryx-swatch .color=${this.getColor(facetValue.value)}></oryx-swatch>
        ${facetValue.name ?? facetValue.value}
      </div>
    `;
  }

  protected getColor(val: string | number): string {
    const value = String(val);
    return this.colors[value.toLowerCase()] ?? value;
  }
}
