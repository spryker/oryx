import { hydratable } from '@spryker-oryx/core';
import { MiscIcons } from '@spryker-oryx/ui/icon';
import { html, LitElement, PropertyValueMap, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { QUANTITY_EVENT } from './quantity-input.model';
import { styles } from './quantity-input.styles';

@hydratable()
export class QuantityInputComponent extends LitElement {
  static styles = styles;

  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) min = 1;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) value = this.min;
  @property({ type: String }) label?: string;

  protected inputRef: Ref<HTMLInputElement> = createRef();

  protected increase(): void {
    this.inputRef.value?.stepUp();
    this.updateQuantity();
  }

  protected decrease(): void {
    this.inputRef.value?.stepDown();
    this.updateQuantity();
  }

  validate(): boolean {
    const input = this.shadowRoot?.querySelector('input') as HTMLInputElement;
    return input.reportValidity();
  }

  protected willUpdate(
    _changedProperties: PropertyValueMap<any> | Map<PropertyKey, unknown>
  ): void {
    //align input's value with property 'value'
    if (
      _changedProperties.has('value') &&
      this.inputRef.value &&
      this.value !== +this.inputRef.value.value
    ) {
      this.inputRef.value.value = String(this.value);
    }
  }

  protected updateQuantity(): void {
    const quantity = Number(this.inputRef.value?.value);
    this.value = quantity;

    this.dispatchEvent(
      new CustomEvent(QUANTITY_EVENT, {
        bubbles: true,
        composed: true,
        detail: {
          quantity,
        },
      })
    );
  }

  protected override render(): TemplateResult {
    return html`
      <button
        aria-label="decrease"
        ?disabled=${this.disabled || this.value <= this.min}
        @click=${this.decrease}
      >
        <oryx-icon type=${MiscIcons.Minus}></oryx-icon>
      </button>
      <oryx-input label=${ifDefined(this.label)}>
        <input
          aria-label="quantity-input"
          type="number"
          ${ref(this.inputRef)}
          value=${this.value}
          min=${this.min}
          max=${ifDefined(this.max)}
          step="1"
          required
          @input=${this.validate}
          @change=${this.updateQuantity}
          ?disabled=${this.disabled}
        />
      </oryx-input>
      <button
        aria-label="increase"
        ?disabled=${this.disabled || !!(this.max && this.value >= this.max)}
        @click=${this.increase}
      >
        <oryx-icon type=${MiscIcons.Add}></oryx-icon>
      </button>
    `;
  }
}
