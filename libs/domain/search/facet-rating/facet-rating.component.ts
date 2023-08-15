import { FacetValue } from '@spryker-oryx/product';
import {
  SearchFacetComponent,
  searchFacetStyles,
} from '@spryker-oryx/search/facet';
import { TemplateResult, html } from 'lit';
import { when } from 'lit/directives/when.js';
import { searchFacetRatingStyles } from './facet-rating.styles';

export class SearchRatingFacetComponent extends SearchFacetComponent {
  static styles = [searchFacetStyles, searchFacetRatingStyles];

  protected override renderValueControlLabel(
    facetValue: FacetValue
  ): TemplateResult {
    return html`
      <div class="rating-facet-label">
        <oryx-rating
          readonly
          value=${facetValue.value}
          scale=${5}
        ></oryx-rating>
        ${when(Number(facetValue.value) < 5, () => html`<span>& up</span>`)}
      </div>
    `;
  }
}
