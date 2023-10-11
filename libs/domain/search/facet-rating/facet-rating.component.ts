import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { FacetValue } from '@spryker-oryx/product';
import {
  SearchFacetComponent,
  searchFacetStyles,
} from '@spryker-oryx/search/facet';
import { Type } from '@spryker-oryx/utilities';
import { TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { SearchRatingFacetComponentOptions } from './facet-rating.model';
import { searchFacetRatingStyles } from './facet-rating.styles';

@defaultOptions({
  min: 1,
  max: 4,
  scale: 5,
})
export class SearchRatingFacetComponent extends ContentMixin<
  SearchRatingFacetComponentOptions,
  unknown,
  Type<SearchFacetComponent>
>(SearchFacetComponent) {
  static styles = [searchFacetStyles, searchFacetRatingStyles];

  protected override renderValues(values: FacetValue[]): TemplateResult | void {
    if (!values?.length) return;

    const { scale, min = 1, max } = this.$options();

    if (!scale || scale < 1) return;

    const normalizedMax = max ? Math.min(max, scale) : scale;
    const normalizedMin = Math.max(min, 1);

    const facet = this.facet();
    const maxRating = Math.min(values[0].value as number, normalizedMax);
    const valuesCount = Math.max(maxRating - normalizedMin + 1, 0);

    const valuesToRender: FacetValue[] = Array.from(
      new Array(valuesCount).keys()
    ).map((i) => {
      const value = maxRating - i;
      return {
        value: String(value),
        selected: facet?.selectedValues?.includes(String(value)) ?? false,
        count: 0,
      };
    });

    return html`<ul>
      ${repeat(
        valuesToRender,
        (facetValue) => String(facetValue.value),
        (facetValue) => html`<li>${this.renderValueControl(facetValue)}</li>`
      )}
    </ul>`;
  }

  protected override renderValueControlLabel(
    facetValue: FacetValue
  ): TemplateResult {
    const { scale } = this.$options();

    if (!scale) {
      return html``;
    }

    return html`
      <label>
        <oryx-rating
          readonly
          value=${facetValue.value}
          scale=${scale}
        ></oryx-rating>
        ${when(
          Number(facetValue.value) < scale,
          () => html`<span>${this.i18n('& up')}</span>`
        )}
      </label>
    `;
  }
}
