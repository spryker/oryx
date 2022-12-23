import { FacetValue } from '@spryker-oryx/product';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { property } from 'lit/decorators.js';
import { FacetController } from './controllers';
import { FacetComponentAttributes, SingleMultiFacet } from './facet.model';
import { SingleFacetControlStyles } from './facet.styles';

export class SearchFacetComponent
  extends LitElement
  implements FacetComponentAttributes
{
  static styles = SingleFacetControlStyles;

  @property() name?: string;
  @property({ type: Boolean }) open?: boolean;
  @property({ type: Boolean }) multi = false;
  @property({ type: Number }) renderLimit = 5;
  @property({ type: Number }) minForSearch = 13;

  protected facetController = new FacetController(this);
  protected facet$ = this.facetController.getFacet();

  protected isSearchable(facet: SingleMultiFacet): boolean {
    return (facet.valuesTreeLength ?? 0) > (this.minForSearch ?? Infinity);
  }

  protected isFoldable(facet: SingleMultiFacet): boolean {
    return (
      (facet?.filteredValueLength ?? facet?.valuesTreeLength ?? 0) >
      (this.renderLimit ?? Infinity)
    );
  }

  protected getValuesLength(facet: SingleMultiFacet): number {
    return facet?.filteredValueLength ?? facet?.valuesTreeLength ?? 0;
  }

  protected onChange(e: InputEvent): void {
    const { value, checked } = e.target as HTMLInputElement;
    this.facetController.dispatchSelectEvent({
      value,
      selected: checked,
    });
  }

  protected renderValueControl(
    facetValue: FacetValue,
    parameter: string
  ): TemplateResult {
    const control = html`<input
        type=${this.multi ? 'checkbox' : 'radio'}
        name=${parameter}
        value=${facetValue.value}
        ?checked=${facetValue.selected}
        @change=${this.onChange}
        title=${facetValue.name ?? facetValue.value}
        aria-label=${facetValue.name ?? facetValue.value}
      />
      ${facetValue.name ?? facetValue.value}
      <span class="counter">${facetValue.count}</span> `;

    return this.multi
      ? html` <oryx-checkbox>${control}</oryx-checkbox> `
      : html` <oryx-radio> ${control} </oryx-radio> `;
  }

  protected renderValues(
    values: FacetValue[],
    parameter: string
  ): TemplateResult | undefined {
    return html`${values.map(
      (facetValue) => html`
        <li>
          ${this.renderValueControl(facetValue, parameter)}
          ${when(
            facetValue.children?.length,
            () =>
              html`<ul>
                ${this.renderValues(facetValue.children ?? [], parameter)}
              </ul>`
          )}
        </li>
      `
    )}`;
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.facet$, (facet) => {
      if (!facet) {
        return html``;
      }

      const valuesLength = this.getValuesLength(facet);

      return html`<oryx-search-facet-value-navigation
        ?open=${this.open}
        ?enableToggle=${this.isFoldable(facet)}
        ?enableSearch=${this.isSearchable(facet)}
        .heading=${facet.name}
        .selectedLength=${facet.selectedValues?.length}
        .valuesLength=${valuesLength}
      >
        ${when(
          valuesLength,
          () => html`<ul>
            ${this.renderValues(facet.values, facet.parameter)}
          </ul>`,
          () => html`${i18n('search.facet.no-results-found')}`
        )}
      </oryx-search-facet-value-navigation>`;
    })}`;
  }
}
