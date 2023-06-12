import { FacetValue } from '@spryker-oryx/product';
import { asyncValue, i18n } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { SingleMultiFacet } from './facet.model';
import { searchFacetStyles } from './facet.styles';
import { FacetComponentMixin } from './facet.mixin';

export class SearchFacetComponent extends FacetComponentMixin() {
  static styles = searchFacetStyles;

  protected onChange(e: InputEvent): void {
    const { value, checked } = e.target as HTMLInputElement;
    this.controller.dispatchSelectEvent({
      value,
      selected: checked,
    });
  }

  protected override render(): TemplateResult | void {
    return html`${asyncValue(this.facet$, ([facet, props]) => {
      if (!facet) return;

      const valuesLength =
        facet?.filteredValueLength ?? facet?.valuesTreeLength ?? 0;

      /* ToDo: refactor enabletoggle, enablesearch and enableclearaction to camelCase.
         On SSR Lit renders boolean attributes in camelCase. For other attributes
         it emulates browser behavior and convert them to lowercase. Lit populates
         reactive props with a data only from lowercased attributes of rendered
         component. That's why enabletoggle, enablesearch and enableclearaction
         was lowercased manually.
      */
      return html`<oryx-search-facet-value-navigation
        ?open=${props.open}
        ?enabletoggle=${this.isFoldable(facet, props.renderLimit)}
        ?enablesearch=${this.isSearchable(facet, props.minForSearch)}
        .heading=${props.name}
        .selectedLength=${facet.selectedValues?.length}
        .valuesLength=${valuesLength}
        ?enableClear="${props.enableClear}"
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

  protected renderValueControlLabel(facetValue: FacetValue): TemplateResult {
    return html`<span>${facetValue.name ?? facetValue.value}</span>`;
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
        ?checked=${facetValue.selected}
        @change=${this.onChange}
        title=${facetValue.name ?? facetValue.value}
        aria-label=${facetValue.name ?? facetValue.value}
      />
      <div class="label">
        ${this.renderValueControlLabel(facetValue)}
        <span class="counter">${facetValue.count}</span>
      </div> `;

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
