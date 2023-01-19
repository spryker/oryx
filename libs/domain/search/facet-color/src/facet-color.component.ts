import { resolve } from '@spryker-oryx/di';
import { FacetValue } from '@spryker-oryx/product';
import { SearchFacetComponent } from '@spryker-oryx/search/facet';
import { html, TemplateResult } from 'lit';
import { FacetColorsMapping } from './facet-color-colors.mapping';

export class SearchColorFacetComponent extends SearchFacetComponent {
  protected colorsMapping = resolve(FacetColorsMapping).reduce(
    (acc, colors) => ({ ...acc, ...colors }),
    {}
  );

  protected getColor(val: string | number): string {
    const value = String(val);

    return this.colorsMapping[value.toLowerCase()] ?? value;
  }

  protected override renderValueControlLabel(
    facetValue: FacetValue
  ): TemplateResult {
    return html`
      <oryx-swatch .color=${this.getColor(facetValue.value)}></oryx-swatch>
      ${facetValue.name ?? facetValue.value}
    `;
  }
}
