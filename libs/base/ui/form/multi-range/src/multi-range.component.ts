import { featureVersion } from '@spryker-oryx/utilities';
import { html, LitElement, PropertyValues, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import {
  MultiRangeChangeEvent,
  MultiRangeProperties,
} from './multi-range.model';
import { multiRangeStyles } from './multi-range.styles';

const defaultMin = 0;
const defaultMax = 100;

export class MultiRangeComponent
  extends LitElement
  implements MultiRangeProperties
{
  static styles = multiRangeStyles;

  protected inputMinRef = createRef<HTMLInputElement>();
  protected inputMaxRef = createRef<HTMLInputElement>();

  protected observedKeys: (keyof MultiRangeComponent)[] = [
    'step',
    'min',
    'max',
    'minValue',
    'maxValue',
  ];

  protected _activeMin?: number;
  protected _activeMax?: number;

  @property({ type: Boolean }) disabled?: boolean;
  @property({ type: Number }) step = 1;

  protected _min = defaultMin;
  @property({ type: Number })
  get min(): number {
    return this._min;
  }
  set min(value: number) {
    const oldValue = this._min;
    if (featureVersion >= '1.2') {
      this._min = value;
    } else {
      this._min = value >= this.max ? this.max - this.step : value;
    }
    this.requestUpdate('min', oldValue);
  }

  protected _max = defaultMax;
  @property({ type: Number })
  get max(): number {
    return this._max;
  }
  set max(value: number) {
    const oldValue = this._max;
    if (featureVersion >= '1.2') {
      this._max = value;
    } else {
      this._max = value <= this.min ? this.min + this.step : value;
    }
    this.requestUpdate('max', oldValue);
  }

  protected _minValue = defaultMin;
  @property({ type: Number })
  get minValue(): number {
    return this._minValue;
  }
  set minValue(value: number) {
    const oldValue = this._minValue;
    if (featureVersion >= '1.2') {
      this._minValue = value;
    } else {
      this._minValue =
        value <= this.min
          ? this.min
          : value >= this.maxValue
          ? this.maxValue - this.step
          : value;
      if (this.inputMinRef && this.inputMinRef.value) {
        this.inputMinRef.value.value = String(this._minValue);
      }
    }
    this.requestUpdate('minValue', oldValue);
  }

  protected _maxValue = defaultMax;
  @property({ type: Number })
  get maxValue(): number {
    return this._maxValue;
  }
  set maxValue(value: number) {
    const oldValue = this._maxValue;
    if (featureVersion >= '1.2') {
      this._maxValue = value;
    } else {
      this._maxValue =
        value >= this.max
          ? this.max
          : value <= this.minValue
          ? this.minValue + this.step
          : value;
      if (this.inputMaxRef && this.inputMaxRef.value) {
        this.inputMaxRef.value.value = String(this._maxValue);
      }
    }
    this.requestUpdate('maxValue', oldValue);
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
    if (featureVersion < '1.2') {
      this.setPercentages(this.minValue, this.maxValue);
    }

    super.update(changedProperties);
  }

  updated(): void {
    if (featureVersion < '1.2') {
      this.syncNativeInputValues();

      this.dispatchSelectEvent(this.minValue, this.maxValue);
    }
  }

  protected syncNativeInputValues(): void {
    this.minValue = Number(this.inputMinRef?.value?.value ?? this.minValue);
    this.maxValue = Number(this.inputMaxRef?.value?.value ?? this.maxValue);
  }

  protected willUpdate(properties: PropertyValues<MultiRangeProperties>): void {
    if (featureVersion >= '1.2') {
      this.ensureValues(properties);
    }

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
    return (
      this.observedKeys.some((key) => typeof this[key] === 'undefined') ||
      this.min! > this.max! - this.step ||
      this.max! < this.min! + this.step
    );
  }

  protected override render(): TemplateResult | void {
    const invalid = featureVersion >= '1.2' && this.hasInvalidRange();

    return html`
      ${this.renderRangeInput(
        featureVersion >= '1.2'
          ? invalid
            ? defaultMin
            : this._activeMin!
          : this.minValue,
        this.inputMinRef,
        true
      )}
      ${this.renderRangeInput(
        featureVersion >= '1.2'
          ? invalid
            ? defaultMax
            : this._activeMax!
          : this.maxValue,
        this.inputMaxRef
      )}
      ${when(!invalid, () => html`<div class="active"></div>`)}
    `;
  }

  protected renderRangeInput(
    value: number,
    inputRef: Ref,
    isFirst = false
  ): TemplateResult {
    const invalid = featureVersion >= '1.2' && this.hasInvalidRange();

    return html`
      <label aria-label=${isFirst ? 'min' : 'max'}>
        <input
          ref="${ref(inputRef)}"
          type="range"
          ?disabled=${invalid || this.disabled}
          ?isFirst=${isFirst}
          min="${invalid ? defaultMin : this.min}"
          max="${invalid ? defaultMax : this.max}"
          value="${value}"
          step="${invalid ? 1 : this.step}"
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

    if (featureVersion >= '1.2') {
      const activeMin = this._activeMin!;
      const activeMax = this._activeMax!;

      //prevent penetration of one slider after another
      if ((isFirst && value >= activeMax) || (!isFirst && value <= activeMin)) {
        input.value = String(
          isFirst ? activeMax - this.step : activeMin + this.step
        );
        return;
      }

      if (isFirst) {
        this._activeMin = value;
      } else {
        this._activeMax = value;
      }

      this.setPercentages(this._activeMin!, this._activeMax!);
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
    if (featureVersion < '1.2') return;

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
