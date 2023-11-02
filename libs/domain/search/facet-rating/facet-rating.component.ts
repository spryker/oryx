import { RangeFacet } from '@spryker-oryx/product';
import {
  FacetController,
  searchFacetStyles,
} from '@spryker-oryx/search/facet';
import { computed, signalProperty, I18nMixin } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { SearchRatingFacetComponentProperties } from './facet-rating.model';
import { searchFacetRatingStyles } from './facet-rating.styles';

export class SearchRatingFacetComponent 
  extends I18nMixin(LitElement) 
  implements SearchRatingFacetComponentProperties {
  static styles = [searchFacetStyles, searchFacetRatingStyles];

  protected controller = new FacetController(this);

  @signalProperty() name?: string;
  @signalProperty({ type: Boolean }) open?: boolean;
  @signalProperty({ type: Boolean }) disableClear?: boolean;
  @signalProperty({type: Number, reflect: true}) min = 1;
  @signalProperty({type: Number, reflect: true}) max = 5;
  @signalProperty({type: Number, reflect: true}) scale = 5;

  protected $facet = computed(() => this.controller.getFacet<RangeFacet>());

  protected $isDirty = computed(() => {
    const facet = this.$facet();

    if (!facet) return false;

    const {
      values: { min, max, selected },
    } = facet;

    return selected?.min !== min || selected?.max !== max;
  });

  protected $values = computed(() => {
    const facet = this.$facet();

    if (!facet || !this.scale || this.scale < 1) return [];

    const {
      values: { min, max },
    } = facet;

    const normalizedMax = (this.max ?? max) ? Math.min((this.max ?? max), this.scale) : this.scale;
    const normalizedMin = this.min ?? min;

    const valuesCount = Math.max(normalizedMax - normalizedMin + 1, 0);

    return Array.from(
      new Array(valuesCount).keys()
    ).map((i) => normalizedMax - i);
  });

  protected override render(): TemplateResult | void {
    const facet = this.$facet();

    if (!facet) return;

    return html`<oryx-search-facet-value-navigation
      ?open=${this.open}
      ?enableClear="${!this.disableClear}"
      ?dirty=${!!this.$isDirty()}
      .heading=${this.name}
    >${this.renderValues(this.$values())}
    </oryx-search-facet-value-navigation>`;
  }

  protected onChange(e: InputEvent): void {
    const { value } = e.target as HTMLInputElement;
    
    this.controller.dispatchSelectEvent({
      selected: { min: +value },
    });
  }

  protected renderValues(values: number[]): TemplateResult | void {
    if (!values?.length) return;

    return html`<ul>
      ${repeat(
        values,
        (facetValue) => String(facetValue),
        (facetValue) => this.renderValue(facetValue)
      )}
    </ul>`;
  }

  protected renderValue(facetValue: number): TemplateResult {
    const selected  = this.$facet()?.values?.selected?.min === facetValue;

    return html`<li>
      <oryx-radio>
        <input
          type="radio"
          name="${this.$facet()!.parameter}"
          value="${facetValue}"
          ?checked=${selected}
          @change=${this.onChange}
          aria-label=${facetValue}
        />
        <div>
          <label>
            <oryx-rating
              readonly
              value=${facetValue}
              scale=${this.scale}
            ></oryx-rating>
            ${when(
              facetValue < this.scale,
              () => html`<span>${this.i18n('search.facet.rating.up')}</span>`
            )}
          </label>
        </div>
      </oryx-radio>
    </li>`;
  }
}
