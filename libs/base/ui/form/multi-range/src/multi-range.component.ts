import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
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

  @query('input[isFirst]') protected inputMin?: HTMLInputElement;

  @query('input:not([isFirst])') protected inputMax?: HTMLInputElement;

  @property({ type: Boolean }) disabled?: boolean;
  @property({ type: Number }) step = 1;
  @property({ type: Number }) min?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) minValue?: number;
  @property({ type: Number }) maxValue?: number;
  @property({ reflect: true, type: Boolean }) invalid = false;

  protected _min?: number;
  protected _max?: number;

  protected observedKeys: (keyof MultiRangeComponent)[] = [
    'min',
    'max',
    'minValue',
    'maxValue',
  ];

  protected willUpdate(properties: PropertyValues<MultiRangeProperties>): void {
    this.ensureValues(properties);

    super.willUpdate(properties);
  }

  protected setPercentages(minValue: number, maxValue: number): void {
    const sliderMinPercentage =
      ((minValue - this.min!) / (this.max! - this.min!)) * 100;
    const sliderMaxPercentage =
      ((maxValue - this.min!) / (this.max! - this.min!)) * 100;

    this.style.setProperty('--_multi-range-min', `${sliderMinPercentage}%`);
    this.style.setProperty(
      '--_multi-range-max',
      `${100 - sliderMaxPercentage}%`
    );
  }

  protected syncNativeInputValues(minValue: number, maxValue: number): void {
    this._min = minValue;
    this._max = maxValue;

    if (this.inputMin) {
      this.inputMin.value = String(minValue);
    }
    if (this.inputMax) {
      this.inputMax.value = String(maxValue);
    }
  }

  protected ensureValues(
    properties: PropertyValues<MultiRangeProperties>
  ): void {
    if (this.hasInvalidRange() || !this.hasDiffs(properties)) return;

    let minValue = this.minValue!;
    let maxValue = this.maxValue!;
    const min = this.min!;
    const max = this.max!;

    const minInRange = minValue >= min && minValue <= max - this.step;
    const maxInRange = maxValue >= min + this.step && maxValue <= max;
    const minBeforeMax = minValue <= maxValue - this.step;

    if (!minInRange || !minBeforeMax) minValue = min;
    if (!maxInRange || !minBeforeMax) maxValue = max;

    this.minValue = minValue;
    this.maxValue = maxValue;

    this.setPercentages(minValue, maxValue);
    this.syncNativeInputValues(minValue, maxValue);
  }

  protected hasDiffs(
    properties: PropertyValues<MultiRangeProperties>
  ): boolean {
    return Array.from(properties.entries()).some(([_key, value]) => {
      const key = _key as keyof MultiRangeComponent;
      return this.observedKeys.includes(key) && this[key] !== value;
    });
  }

  protected hasInvalidRange(): boolean {
    this.invalid =
      this.observedKeys.some((key) => typeof this[key] === 'undefined') ||
      this.min! > this.max! - this.step ||
      this.max! < this.min! + this.step;

    return this.invalid;
  }

  protected override render(): TemplateResult | void {
    if (this.invalid) return;

    return html`
      ${this.renderRangeInput(this._min!, true)}
      ${this.renderRangeInput(this._max!)}
    `;
  }

  protected renderRangeInput(value: number, isFirst = false): TemplateResult {
    return html`
      <label aria-label=${isFirst ? 'min' : 'max'}>
        <input
          type="range"
          ?disabled=${this.disabled}
          ?isFirst=${isFirst}
          min="${this.min!}"
          max="${this.max!}"
          value="${value}"
          step="${this.step}"
          @input="${this.onUpdate}"
          @change="${this.onSelect}"
        />
      </label>
    `;
  }

  protected onUpdate(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    const isFirst = input.hasAttribute('isFirst');

    //prevent penetration of one slider after another
    if ((isFirst && value >= this._max!) || (!isFirst && value <= this._min!)) {
      input.value = String(isFirst ? this._min : this._max);
      return;
    }

    if (isFirst) {
      this._min = value;
    } else {
      this._max = value;
    }

    this.setPercentages(this._min!, this._max!);
  }

  protected onSelect(): void {
    const minValue = (this.minValue = this._min!);
    const maxValue = (this.maxValue = this._max!);

    this.dispatchEvent(
      new CustomEvent<MultiRangeChangeEvent>('change', {
        bubbles: true,
        composed: true,
        detail: { minValue, maxValue },
      })
    );
  }
}
