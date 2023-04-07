import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { MultiRangeProperties } from './multi-range.model';
import { multiRangeStyles } from './multi-range.styles';

export class MultiRangeComponent
  extends LitElement
  implements MultiRangeProperties
{
  static styles = multiRangeStyles;

  protected inputMinRef = createRef<HTMLInputElement>();
  protected inputMaxRef = createRef<HTMLInputElement>();

  @property({ type: Boolean }) disabled?: boolean;
  @property({ type: Number }) step = 1;

  @property({ type: Number }) min = 0;
  @property({ type: Number }) max = 100;
  @property({ type: Number }) minValue = 0;
  @property({ type: Number }) maxValue = 100;

  update(changedProperties: PropertyValues): void {
    if (
      this.min >= this.max ||
      this.minValue >= this.max ||
      this.minValue >= this.maxValue ||
      this.maxValue > this.max ||
      this.minValue < this.min ||
      this.step > this.max - this.min
    ) {
      console.error(
        'MultiRangeComponent',
        'Provided attributes has conflicting values. Check it, please'
      );
    }

    const calculatePercentage = (
      value: number,
      minValue: number,
      maxValue: number
    ) => ((value - minValue) / (maxValue - minValue)) * 100;

    const sliderMinPercentage = calculatePercentage(
      this.minValue,
      this.min,
      this.max
    );

    const sliderMaxPercentage = calculatePercentage(
      this.maxValue,
      this.min,
      this.max
    );

    this.style.setProperty('--_multi-range-min', `${sliderMinPercentage}%`);
    this.style.setProperty(
      '--_multi-range-max',
      `${100 - sliderMaxPercentage}%`
    );
    super.update(changedProperties);
  }

  updated(): void {
    this.syncNativeInputValues();

    this.dispatchEvent(
      new CustomEvent('change', {
        bubbles: true,
        composed: true,
        detail: {
          minValue: this.minValue,
          maxValue: this.maxValue,
        },
      })
    );
  }

  protected syncNativeInputValues(): void {
    this.minValue = Number(this.inputMinRef?.value?.value ?? this.minValue);
    this.maxValue = Number(this.inputMaxRef?.value?.value ?? this.maxValue);
  }

  protected override render(): TemplateResult {
    return html`
      ${this.renderRangeInput(this.minValue, this.inputMinRef, true)}
      ${this.renderRangeInput(this.maxValue, this.inputMaxRef)}
      <div class="active"></div>
    `;
  }

  protected renderRangeInput(
    value: number,
    inputRef: Ref,
    isFirst = false
  ): TemplateResult {
    return html`
      <label aria-label=${isFirst ? 'min' : 'max'}>
        <input
          ref="${ref(inputRef)}"
          type="range"
          ?disabled=${this.disabled}
          ?isFirst=${isFirst}
          min="${this.min}"
          max="${this.max}"
          value="${value}"
          step="${this.step}"
          @input="${this.onUpdate}"
        />
      </label>
    `;
  }

  protected onUpdate(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);

    if (input.hasAttribute('isFirst')) {
      if (value >= this.maxValue) {
        input.value = String(this.maxValue - this.step);
      }
      this.minValue = Number(input.value);
    } else {
      if (value <= this.minValue) {
        input.value = String(this.minValue + this.step);
      }
      this.maxValue = Number(input.value);
    }
  }
}
