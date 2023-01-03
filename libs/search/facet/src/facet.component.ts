import { FacetValue } from '@spryker-oryx/product';
import { i18n } from '@spryker-oryx/utilities/i18n';
import { asyncValue } from '@spryker-oryx/utilities/lit-rxjs';
import { html, TemplateResult } from 'lit';
import { repeat } from 'lit-html/directives/repeat.js';
import { when } from 'lit-html/directives/when.js';
import { SingleMultiFacet } from './facet.model';
import { SingleFacetControlStyles } from './facet.styles';

import { FacetComponentMixin } from '../../src/mixins/facet.mixin';

export class SearchFacetComponent extends FacetComponentMixin() {
  static styles = SingleFacetControlStyles;

  protected onChange(e: InputEvent): void {
    const { value, checked } = e.target as HTMLInputElement;
    this.controller.dispatchSelectEvent({
      value,
      selected: checked,
    });
  }

  protected override render(): TemplateResult {
    return html`${asyncValue(this.facet$, ([facet, props]) => {
      if (!facet) {
        return html``;
      }

      const valuesLength =
        facet?.filteredValueLength ?? facet?.valuesTreeLength ?? 0;

      return html`<oryx-search-facet-value-navigation
        ?open=${props.open}
        ?enableToggle=${this.isFoldable(facet, props.renderLimit)}
        ?enableSearch=${this.isSearchable(facet, props.minForSearch)}
        .heading=${props.name}
        .selectedLength=${facet.selectedValues?.length}
        .valuesLength=${valuesLength}
      >
        ${when(
          valuesLength,
          () => this.renderValues(facet.values, facet.parameter, props.multi),
          () => html`${i18n('search.facet.no-results-found')}`
        )}
      </oryx-search-facet-value-navigation>`;
    })}`;
  }

  protected renderValues(
    values: FacetValue[],
    parameter: string,
    multi = false
  ): TemplateResult | undefined {
    return html`<ul>
      ${repeat(
        values,
        (facetValue) => facetValue.value,
        (facetValue) => html`
          <li>
            ${this.renderValueControl(facetValue, parameter, multi)}
            ${when(
              facetValue.children?.length,
              () =>
                html`${this.renderValues(
                  facetValue.children ?? [],
                  parameter,
                  multi
                )}`
            )}
          </li>
        `
      )}
    </ul>`;
  }

  protected renderValueControl(
    facetValue: FacetValue,
    parameter: string,
    multi: boolean
  ): TemplateResult {
    const control = html`<input
        type=${multi ? 'checkbox' : 'radio'}
        name=${parameter}
        value=${facetValue.value}
        .checked=${facetValue.selected}
        @change=${this.onChange}
        title=${facetValue.name ?? facetValue.value}
        aria-label=${facetValue.name ?? facetValue.value}
      />
      ${facetValue.name ?? facetValue.value}
      <span class="counter">${facetValue.count}</span> `;

    return multi
      ? html` <oryx-checkbox>${control}</oryx-checkbox> `
      : html` <oryx-radio>${control}</oryx-radio> `;
  }

  protected isSearchable(
    facet: SingleMultiFacet,
    minForSearch?: number
  ): boolean {
    return (facet.valuesTreeLength ?? 0) > (minForSearch ?? Infinity);
  }

  protected isFoldable(facet: SingleMultiFacet, renderLimit?: number): boolean {
    return (
      (facet?.filteredValueLength ?? facet?.valuesTreeLength ?? 0) >
      (renderLimit ?? Infinity)
    );
  }
}
