import { RangeFacet, RangeFacetValue } from '@spryker-oryx/product';
import { TemplateResult, html } from 'lit';
// use relative path for dev ssr server, SearchFacetComponent is undefined
import { MultiRangeChangeEvent } from '@spryker-oryx/ui/multi-range';
import {
  computed,
  debounce,
  effect,
  elementEffect,
  signalProperty,
} from '@spryker-oryx/utilities';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { SearchFacetComponent } from '../facet/facet.component';
import {
  SearchFacetRangeComponentAttributes,
  SearchFacetRangeComponentValues,
} from './facet-range.model';
import { searchRangeFacetStyles } from './facet-range.styles';

export class SearchRangeFacetComponent
  extends SearchFacetComponent
  implements
    SearchFacetRangeComponentAttributes,
    SearchFacetRangeComponentValues
{
  static styles = [...SearchFacetComponent.styles, searchRangeFacetStyles];

  @signalProperty({ type: Number }) step = 1;
  @signalProperty() labelMin?: string;
  @signalProperty() labelMax?: string;
  @state() min?: number;
  @state() max?: number;

  protected $isDirty = computed(() => {
    const facet = this.facet() as RangeFacet;

    if (!facet) return false;

    const {
      values: { min, max, selected },
    } = facet;

    return selected?.min !== min || selected?.max !== max;
  });

  @elementEffect()
  protected $syncValues = effect(() => {
    const facet = this.facet() as RangeFacet;

    if (!facet) return;

    const {
      values: { min, max, selected },
    } = facet;

    this.min = selected?.min ?? min;
    this.max = selected?.max ?? max;
  });

  protected onRangeChange = debounce(
    (e: CustomEvent<MultiRangeChangeEvent>): void => {
      const { minValue: min, maxValue: max } = e.detail;
      const selected = { min, max };

      if (this.hasChangedValue(selected)) {
        this.min = min;
        this.max = max;
        this.controller.dispatchSelectEvent({ selected });
      }
    },
    300
  );

  protected onBlur(e: InputEvent): void {
    const { value, name } = e.target as HTMLInputElement;
    this[name as keyof SearchFacetRangeComponentValues] = Number(value);
  }

  protected onKeydown(e: KeyboardEvent): void {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  }

  protected hasChangedValue({ min, max }: RangeFacetValue): boolean {
    const facet = this.facet() as RangeFacet;
    const {
      values: { selected },
    } = facet;
    return selected?.min !== min || selected?.max !== max;
  }

  protected override render(): TemplateResult | void {
    const facet = this.facet() as RangeFacet;

    if (!facet) return;

    return html`<oryx-search-facet-value-navigation
      ?open="${this.open}"
      ?enableClear="${this.enableClear}"
      ?dirty="${this.$isDirty()}"
      .heading="${this.name}"
    >
      <section>${this.renderControls(facet)}</section>
    </oryx-search-facet-value-navigation>`;
  }

  protected renderInput(
    name: keyof SearchFacetRangeComponentValues,
    min: number,
    max: number,
    label: string = name
  ): TemplateResult {
    return html`
      <oryx-input .label=${label}>
        <input
          aria-label=${ifDefined(label)}
          name=${name}
          type="number"
          .value=${String(this[name])}
          min=${min}
          max=${max}
          step=${this.step}
          @blur=${this.onBlur}
          @keydown=${this.onKeydown}
        />
      </oryx-input>
    `;
  }

  protected renderControls(facet: RangeFacet): TemplateResult {
    const {
      values: { min, max },
    } = facet;
    return html`
      ${this.renderInput('min', min, max - 1, this.labelMin)}

      <span></span>

      ${this.renderInput('max', min + 1, max, this.labelMax)}

      <oryx-multi-range
        .min="${min}"
        .max="${max}"
        .minValue="${this.min}"
        .maxValue="${this.max}"
        .step="${this.step}"
        @change="${this.onRangeChange}"
      ></oryx-multi-range>
    `;
  }
}
