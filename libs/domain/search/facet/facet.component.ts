import { FacetValue } from '@spryker-oryx/product';
import {
  computed,
  I18nMixin,
  signalAware,
  signalProperty,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { FacetController } from './controllers';
import { searchFacetStyles } from './facet.styles';

@signalAware()
export class SearchFacetComponent extends I18nMixin(LitElement) {
  static styles = [searchFacetStyles];

  protected controller = new FacetController(this);

  @signalProperty() name?: string;
  @signalProperty({ type: Boolean }) open = false;
  @signalProperty({ type: Boolean }) multi = false;
  @signalProperty({ type: Number }) renderLimit = 5;
  @signalProperty({ type: Number }) minForSearch = 13;
  @signalProperty({ type: Boolean }) enableClear = true;

  protected facet = computed(() => this.controller.getFacet());

  protected onChange(e: InputEvent): void {
    const { value, checked: selected } = e.target as HTMLInputElement;
    this.controller.dispatchSelectEvent({
      value,
      selected,
    });
  }

  protected override render(): TemplateResult | void {
    const facet = this.facet();

    if (!facet) return;

    const valuesLength = facet.filteredValueLength ?? facet.valuesTreeLength;
    const selectedLength = facet.selectedValues?.length;

    return html`<oryx-search-facet-value-navigation
      ?open=${this.open}
      ?enableToggle=${this.isFoldable}
      ?enableSearch=${this.isSearchable}
      ?enableClear="${this.enableClear}"
      .heading=${this.name}
      .selectedLength=${selectedLength}
      .valuesLength=${valuesLength}
    >
      ${when(
        valuesLength,
        () => this.renderValues(facet.values),
        () => html`${this.i18n('search.facet.no-results-found')}`
      )}
    </oryx-search-facet-value-navigation>`;
  }

  protected renderValueControlLabel(facetValue: FacetValue): TemplateResult {
    return html`<span>${facetValue.name ?? facetValue.value}</span>`;
  }

  protected renderValues(values?: FacetValue[]): TemplateResult | void {
    if (!values?.length) return;

    return html`<ul>
      ${repeat(
        values,
        (facetValue) => String(facetValue.value),
        (facetValue) => html`<li>
          ${this.renderValueControl(facetValue)}
          ${this.renderValues(facetValue.children)}
        </li>`
      )}
    </ul>`;
  }

  protected renderValueControl(facetValue: FacetValue): TemplateResult {
    const label = facetValue.name ?? facetValue.value;
    const control = html`<input
        type=${this.multi ? 'checkbox' : 'radio'}
        name=${this.facet()!.parameter}
        value=${facetValue.value}
        ?checked=${facetValue.selected}
        @change=${this.onChange}
        aria-label=${label}
      />
      <div>
        ${this.renderValueControlLabel(facetValue)}
        <span>${facetValue.count}</span>
      </div> `;

    return this.multi
      ? html` <oryx-checkbox>${control}</oryx-checkbox> `
      : html` <oryx-radio>${control}</oryx-radio> `;
  }

  protected get isSearchable(): boolean {
    return (
      (this.facet()?.valuesTreeLength ?? 0) > (this.minForSearch ?? Infinity)
    );
  }

  protected get isFoldable(): boolean {
    const facet = this.facet();

    return (
      (facet?.filteredValueLength ?? facet?.valuesTreeLength ?? 0) >
      (this.renderLimit ?? Infinity)
    );
  }
}
