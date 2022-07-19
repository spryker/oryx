import { Size } from '@spryker-oryx/ui/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { styles } from './quantity-input.styles';

export class QuantityInputComponent extends LitElement {
  static styles = styles;

  @property({ type: Boolean }) disabled = false;
  @property({ type: Number }) min = 1;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) value = this.min;

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

  protected updateQuantity(): void {
    this.value = Number(this.inputRef.value?.value);

    const updateEvent = new CustomEvent('update', {
      bubbles: true,
      composed: true,
      detail: {
        quantity: Number(this.inputRef.value?.value),
      },
    });

    this.dispatchEvent(updateEvent);
  }

  protected override render(): TemplateResult {
    return html`
      <button
        aria-label="decrease"
        ?disabled=${this.disabled || this.value <= this.min}
        @click=${this.decrease}
      >
        <!-- TODO: use enum for "type" attribute when the paths issue will be resolved -->
        <oryx-icon type="minus" size=${Size.small}></oryx-icon>
      </button>
      <oryx-input>
        <input
          type="number"
          ${ref(this.inputRef)}
          value=${this.value}
          min=${this.min}
          max=${this.max}
          step="1"
          required
          @input=${this.validate}
          @change=${this.updateQuantity}
          ?disabled=${this.disabled}
        />
      </oryx-input>
      <button
        aria-label="increase"
        ?disabled=${this.disabled || (this.max && this.value >= this.max)}
        @click=${this.increase}
      >
        <!-- TODO: use enum for "type" attribute when the paths issue will be resolved -->
        <oryx-icon type="add" size=${Size.small}></oryx-icon>
      </button>
    `;
  }
}
