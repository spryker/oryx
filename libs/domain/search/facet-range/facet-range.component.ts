import { RangeFacet, RangeFacetValue } from '@spryker-oryx/product';
import { MultiRangeChangeEvent } from '@spryker-oryx/ui/multi-range';
import {
  computed,
  debounce,
  effect,
  elementEffect,
  signalProperty,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { FacetController } from '../facet/controllers';
import {
  SearchFacetRangeComponentAttributes,
  SearchFacetRangeComponentValues,
} from './facet-range.model';
import { searchRangeFacetStyles } from './facet-range.styles';

export class SearchRangeFacetComponent
  extends LitElement
  implements SearchFacetRangeComponentAttributes
{
  static styles = [searchRangeFacetStyles];

  protected controller = new FacetController(this);

  @signalProperty() name?: string;
  @signalProperty({ type: Boolean }) open = false;
  @signalProperty({ type: Boolean }) enableClear = true;
  @signalProperty({ type: Number }) step = 1;
  @signalProperty() labelMin?: string;
  @signalProperty() labelMax?: string;

  @state() min?: number;
  @state() max?: number;

  protected facet = computed(() => this.controller.getFacet() as RangeFacet);

  protected $isDirty = computed(() => {
    const {
      values: { min, max, selected },
    } = this.facet();

    return selected?.min !== min || selected?.max !== max;
  });

  @elementEffect()
  protected $syncValues = effect(() => {
    const facet = this.facet();

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
    const {
      values: { selected },
    } = this.facet();
    return selected?.min !== min || selected?.max !== max;
  }

  protected override render(): TemplateResult | void {
    const facet = this.facet();

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
          value=${String(this[name])}
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
