import { FacetValue } from '@spryker-oryx/product';
import {
  SearchFacetComponent,
  searchFacetStyles,
} from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { RatingFacetComponentProperties } from './facet-rating.model';
import { searchFacetRatingStyles } from './facet-rating.styles';

export class SearchRatingFacetComponent
  extends SearchFacetComponent
  implements RatingFacetComponentProperties
{
  static styles = [searchFacetStyles, searchFacetRatingStyles];

  @property({ type: Number }) min = 1;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) scale?: number;

  protected override renderValues(values: FacetValue[]): TemplateResult | void {
    if (!this.scale) {
      return;
    }

    const facet = this.facet();

    if (!values?.length) return;
    const maxRating = values[0].value as number;

    const valuesCount =
      (maxRating
        ? maxRating - this.min
        : this.max
        ? this.max - this.min
        : this.scale - this.min) + 1;

    const valuesToRender: FacetValue[] = Array.from(
      new Array(valuesCount).keys()
    )
      .reverse()
      .map((i) => {
        const value = i + this.min;
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
    if (!this.scale) {
      return html``;
    }

    return html`
      <label>
        <oryx-rating
          readonly
          value=${facetValue.value}
          scale=${this.scale}
        ></oryx-rating>
        ${when(
          Number(facetValue.value) < Number(this.scale),
          () => html`<span>& up</span>`
        )}
      </label>
    `;
  }
}
