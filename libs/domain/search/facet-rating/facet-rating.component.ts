import { RangeFacet } from '@spryker-oryx/product';
import { FacetController, searchFacetStyles } from '@spryker-oryx/search/facet';
import { I18nMixin, computed } from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { SearchRatingFacetComponentProperties } from './facet-rating.model';
import { searchFacetRatingStyles } from './facet-rating.styles';

export class SearchRatingFacetComponent
  extends I18nMixin(LitElement)
  implements SearchRatingFacetComponentProperties
{
  static styles = [searchFacetStyles, searchFacetRatingStyles];

  protected controller = new FacetController(this);

  @property() name?: string;
  @property({ type: Boolean }) open?: boolean;
  @property({ type: Boolean }) disableClear?: boolean;
  @property({ type: Number, reflect: true }) min?: number;
  @property({ type: Number, reflect: true }) max?: number;
  @property({ type: Number, reflect: true }) scale = 5;

  protected $facet = computed(() => this.controller.getFacet<RangeFacet>());

  protected $isDirty = computed(() => {
    const facet = this.$facet();

    if (!facet) return false;

    const {
      values: { min, max, selected },
    } = facet;

    return selected?.min !== min || selected?.max !== max;
  });

  protected getValues(): number[] {
    const facet = this.$facet();

    if (!facet || !this.scale) return [];

    const {
      values: { min, max },
    } = facet;

    const normalizedMax = Math.min(this.max ?? max, this.scale);

    return Array.from(
      new Array(normalizedMax - Math.max(this.min ?? min, 0) + 1).keys()
    ).map((i) => normalizedMax - i);
  }

  protected override render(): TemplateResult | void {
    const facet = this.$facet();

    if (!facet) return;

    return html`<oryx-search-facet-value-navigation
      ?open=${this.open}
      ?enableClear="${!this.disableClear}"
      ?dirty=${!!this.$isDirty()}
      .heading=${this.name}
      >${this.renderValues(this.getValues())}
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
    const selected = this.$facet()?.values?.selected?.min === facetValue;

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
