import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import {
  MultiRangeChangeEvent,
  MultiRangeProperties,
} from './multi-range.model';
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

  protected _min = 0;
  @property({ type: Number })
  get min(): number {
    return this._min;
  }
  set min(value: number) {
    const oldValue = this._min;
    this._min = value >= this.max ? this.max - this.step : value;
    this.requestUpdate('min', oldValue);
  }

  protected _max = 100;
  @property({ type: Number })
  get max(): number {
    return this._max;
  }
  set max(value: number) {
    const oldValue = this._max;
    this._max = value <= this.min ? this.min + this.step : value;
    this.requestUpdate('max', oldValue);
  }

  protected _maxValue = 100;
  @property({ type: Number })
  get maxValue(): number {
    return this._maxValue;
  }
  set maxValue(value: number) {
    const oldValue = this._maxValue;
    this._maxValue =
      value >= this.max
        ? this.max
        : value <= this.minValue
        ? this.minValue + this.step
        : value;
    if (this.inputMaxRef && this.inputMaxRef.value) {
      this.inputMaxRef.value.value = String(this._maxValue);
    }
    this.requestUpdate('maxValue', oldValue);
  }

  protected _minValue = 0;
  @property({ type: Number })
  get minValue(): number {
    return this._minValue;
  }
  set minValue(value: number) {
    const oldValue = this._minValue;
    this._minValue =
      value <= this.min
        ? this.min
        : value >= this.maxValue
        ? this.maxValue - this.step
        : value;
    if (this.inputMinRef && this.inputMinRef.value) {
      this.inputMinRef.value.value = String(this._minValue);
    }
    this.requestUpdate('minValue', oldValue);
  }

  update(changedProperties: PropertyValues): void {
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
      new CustomEvent<MultiRangeChangeEvent>('change', {
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
