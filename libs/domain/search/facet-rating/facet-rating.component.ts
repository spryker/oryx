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
    const { scale, min = 1, max } = this.$options();

    if (!scale) {
      return;
    }

    const facet = this.facet();

    if (!values?.length) return;
    const maxRating = values[0].value as number;

    const limitedMaxRating = max
      ? maxRating > max
        ? max
        : maxRating
      : maxRating;
    const valuesCount =
      (limitedMaxRating ? limitedMaxRating - min : scale - min) + 1;

    const valuesToRender: FacetValue[] = Array.from(
      new Array(valuesCount).keys()
    )
      .reverse()
      .map((i) => {
        const value = i + min;
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

  protected renderValueControlLabel(facetValue: FacetValue): TemplateResult {
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
          Number(facetValue.value) < Number(scale),
          () => html`<span>& up</span>`
        )}
      </label>
    `;
  }
}
