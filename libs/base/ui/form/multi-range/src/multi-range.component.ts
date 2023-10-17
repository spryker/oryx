import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import {
  MultiRangeChangeEvent,
  MultiRangeProperties,
} from './multi-range.model';
import { multiRangeStyles } from './multi-range.styles';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { featureVersion } from '@spryker-oryx/utilities';

export class MultiRangeComponent
  extends LitElement
  implements MultiRangeProperties
{
  static styles = multiRangeStyles;

  protected inputMinRef = createRef<HTMLInputElement>();
  protected inputMaxRef = createRef<HTMLInputElement>();

  protected observedKeys: (keyof MultiRangeComponent)[] = [
    'min',
    'max',
    'minValue',
    'maxValue',
  ];

  protected _activeMin?: number;
  protected _activeMax?: number;

  @property({ type: Boolean }) disabled?: boolean;
  @property({ type: Number }) step = 1;

  protected _min = 0;
  @property({ type: Number })
  get min(): number {
    return this._min;
  }
  set min(value: number) {
    if (featureVersion > '1.1') {
      this._min = value;
    } else {
      const oldValue = this._min;
      this._min = value >= this.max ? this.max - this.step : value;
      this.requestUpdate('min', oldValue);
    }
  }

  protected _max = 100;
  @property({ type: Number })
  get max(): number {
    return this._max;
  }
  set max(value: number) {
    if (featureVersion > '1.1') {
      this._max = value;
    } else {
      const oldValue = this._max;
      this._max = value <= this.min ? this.min + this.step : value;
      this.requestUpdate('max', oldValue);
    }
  }

  protected _minValue = 0;
  @property({ type: Number })
  get minValue(): number {
    return this._minValue;
  }
  set minValue(value: number) {
    if (featureVersion > '1.1') {
      this._minValue = value;
    } else {
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
  }

  protected _maxValue = 100;
  @property({ type: Number })
  get maxValue(): number {
    return this._maxValue;
  }
  set maxValue(value: number) {
    if (featureVersion > '1.1') {
      this._maxValue = value;
    } else {
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

  update(changedProperties: PropertyValues): void {
    if (featureVersion <= '1.1') {
      this.setPercentages(this.minValue, this.maxValue);
    }
 
    super.update(changedProperties);
  }

  updated(): void {
    if (featureVersion <= '1.1') {
      this.syncNativeInputValues();

      this.dispatchSelectEvent(this.minValue, this.maxValue);
    }
  }

  protected syncNativeInputValues(): void {
    this.minValue = Number(this.inputMinRef?.value?.value ?? this.minValue);
    this.maxValue = Number(this.inputMaxRef?.value?.value ?? this.maxValue);
  }

  protected willUpdate(properties: PropertyValues<MultiRangeProperties>): void {
    this.ensureValues(properties);

    super.willUpdate(properties);
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
    this.syncValues(minValue, maxValue);
  }

  protected hasDiffs(
    properties: PropertyValues<MultiRangeProperties>
  ): boolean {
    return Array.from(properties.entries()).some(([_key, value]) => {
      const key = _key as keyof MultiRangeComponent;
      return this.observedKeys.includes(key) && this[key] !== value;
    });
  }

  protected syncValues(minValue: number, maxValue: number): void {
    this._activeMin = minValue;
    this._activeMax = maxValue;

    if (this.inputMinRef?.value) {
      this.inputMinRef.value.value = String(minValue);
    }
    if (this.inputMaxRef?.value) {
      this.inputMaxRef.value.value = String(maxValue);
    }
  }

  protected hasInvalidRange(): boolean {
    return this.observedKeys.some((key) => typeof this[key] === 'undefined') ||
      this.min! > this.max! - this.step ||
      this.max! < this.min! + this.step;
  }

  protected override render(): TemplateResult | void {
    if (featureVersion > '1.1' && this.hasInvalidRange()) return;

    return html`
      ${this.renderRangeInput(
        featureVersion > '1.1' ? this._activeMin!: this.minValue,
        this.inputMinRef,
        true)}
      ${this.renderRangeInput(
        featureVersion > '1.1' ? this._activeMax!: this.maxValue,
        this.inputMaxRef
      )}
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
          @change="${this.onSelect}"
        />
      </label>
    `;
  }

  protected onUpdate(e: Event): void {
    const input = e.target as HTMLInputElement;
    const value = Number(input.value);
    const isFirst = input.hasAttribute('isFirst');

    if (featureVersion > '1.1') {
      const activeMin = this._activeMin!;
      const activeMax = this._activeMax!;
      //prevent penetration of one slider after another
      if ((isFirst && value >= activeMax) || (!isFirst && value <= activeMin)) {
        input.value = String(isFirst ? activeMin : activeMax);
        return;
      }

      if (isFirst) {
        this._activeMin = value;
      } else {
        this._activeMax = value;
      }

      this.setPercentages(activeMin, activeMax);
    } else {
      if (isFirst) {
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

  protected onSelect(): void {
    const minValue = (this.minValue = this._activeMin!);
    const maxValue = (this.maxValue = this._activeMax!);

    this.dispatchSelectEvent(minValue, maxValue);
  }

  protected dispatchSelectEvent(minValue: number, maxValue: number): void {
    this.dispatchEvent(
      new CustomEvent<MultiRangeChangeEvent>('change', {
        bubbles: true,
        composed: true,
        detail: { minValue, maxValue },
      })
    );
  }
}
