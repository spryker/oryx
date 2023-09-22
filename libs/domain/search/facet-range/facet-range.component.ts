import { RangeFacet } from '@spryker-oryx/product';
import { TemplateResult, html } from 'lit';
// use relative path for dev ssr server, SearchFacetComponent is undefined
import { MultiRangeChangeEvent } from '@spryker-oryx/ui/multi-range';
import { property } from 'lit/decorators.js';
import { SearchFacetComponent } from '../facet/facet.component';
import { SearchFacetRangeComponentAttributes } from './facet-range.model';
import { searchRangeFacetStyles } from './facet-range.styles';

export class SearchRangeFacetComponent
  extends SearchFacetComponent
  implements SearchFacetRangeComponentAttributes
{
  static styles = [...SearchFacetComponent.styles, searchRangeFacetStyles];

  @property({ type: Number }) step = 1;

  protected override render(): TemplateResult | void {
    const facet = this.facet();

    if (!facet) return;

    return html`<oryx-search-facet-value-navigation
      ?open="${this.open}"
      ?enableClear="${this.enableClear}"
      .heading="${this.name}"
    >
      <section>${this.renderControls(facet as RangeFacet)}</section>
    </oryx-search-facet-value-navigation>`;
  }

  protected onRangeChange(e: CustomEvent<MultiRangeChangeEvent>): void {
    console.log(e.detail);
  }

  protected onInput(e: InputEvent): void {
    const { value } = e.target as HTMLInputElement;
    console.log(value, 'input');

    // this.controller.dispatchSelectEvent({
    //   value,
    // });
  }

  protected onBlur(e: InputEvent): void {
    const { value } = e.target as HTMLInputElement;
    console.log(value, 'blur');

    // this.controller.dispatchSelectEvent({
    //   value,
    // });
  }

  protected renderControls(facet: RangeFacet): TemplateResult {
    const {
      labels,
      values: { min, max, selected },
    } = facet;
    const minValue = selected?.min ?? min;
    const maxValue = selected?.max ?? max;
    return html`
      <oryx-input .label=${labels?.min}>
        <input
          aria-label=${this.i18n('search.price-min')}
          type="number"
          .value=${String(minValue)}
          min=${min}
          max=${max - 1}
          step=${this.step}
          @input=${this.onInput}
          @blur=${this.onBlur}
        />
      </oryx-input>

      <span>-</span>

      <oryx-input .label=${labels?.max}>
        <input
          aria-label=${this.i18n('search.price-max')}
          type="number"
          .value=${String(maxValue)}
          min=${min + 1}
          max=${max}
          step=${this.step}
          @input=${this.onInput}
          @blur=${this.onBlur}
        />
      </oryx-input>

      <oryx-multi-range
        .min="${min}"
        .max="${max}"
        .minValue="${minValue}"
        .maxValue="${maxValue}"
        .step="${this.step}"
        @change="${this.onRangeChange}"
      ></oryx-multi-range>
    `;
  }
}
