import { IconTypes } from '@spryker-oryx/ui/icon';
import { hydratable, i18n, Size } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  QuantityEventDetail,
  QuantityInputAttributes,
  SUBMIT_EVENT,
  UPDATE_EVENT,
} from './quantity-input.model';
import { styles } from './quantity-input.styles';

/**
 * The quantity input component provides controls to conveniently increase and
 * decrease the quantity. The component is typically used to change the quantity
 * of a cart item, but it can be used in any context.
 *
 * The html min, max and step attribute are used on the input component, so that
 * the quantity stays in the appropriate boundaries and increases with the right step.
 *
 * The quantity control dispatches an update or submit event. The submit event will be
 * dispatched when the Enter key is dispatched, To submit on each change even, the
 * `submitOnChange` property can be set.
 */
@hydratable(['window:load'])
export class QuantityInputComponent
  extends LitElement
  implements QuantityInputAttributes
{
  static styles = styles;

  @property() label?: string;
  @property({ type: Number }) min = 1;
  @property({ type: Number }) value?: number;
  @property({ type: Number }) max?: number;
  @property({ type: Number }) step = 1;
  @property({ type: Boolean }) submitOnChange = false;
  @property({ type: Boolean }) disabled = false;
  @property({ type: Boolean }) hasError = false;
  @property() decreaseIcon?: IconTypes;
  @property() increaseIcon?: IconTypes;

  protected inputRef = createRef<HTMLInputElement>();

  reset(): void {
    if (!this.input) return;
    this.input.value = this.min.toString();
  }

  protected override render(): TemplateResult {
    return html`
      <button
        @click=${this.decrease}
        aria-label=${i18n('cart.quantity.decrease')}
        tabindex="-1"
        ?disabled=${this.isMinDisabled()}
        part="decrease"
      >
        <oryx-icon
          .type=${this.decreaseIcon ?? IconTypes.Decrease}
          size=${Size.Md}
        ></oryx-icon>
      </button>
      <oryx-input
        ?hasError=${this.hasError}
        label=${ifDefined(this.label)}
        floatDisabled
      >
        <input
          ${ref(this.inputRef)}
          aria-label=${i18n('cart.quantity')}
          type="number"
          .value=${this.getValue()}
          min=${this.min}
          max=${ifDefined(this.max)}
          step=${this.step}
          required
          ?disabled=${this.disabled ||
          (this.max !== undefined && this.max === 0)}
          @input=${this.onInput}
          @change=${this.onChange}
          @keydown=${this.onKeydown}
          @focus=${this.onFocus}
        />
      </oryx-input>
      <button
        @click=${this.increase}
        aria-label=${i18n('cart.quantity.increase')}
        tabindex="-1"
        ?disabled=${this.isMaxDisabled()}
        part="increase"
      >
        <oryx-icon
          .type=${this.increaseIcon ?? IconTypes.Increase}
          size=${Size.Md}
        ></oryx-icon>
      </button>
    `;
  }

  focus(): void {
    this.input?.focus();
  }

  firstUpdated(): void {
    this.checkValidity();
  }

  protected getValue(): string {
    return this.value?.toString() ?? this.min?.toString();
  }

  protected onFocus(): void {
    this.checkValidity();
  }

  protected isMinDisabled(): boolean {
    return this.disabled || (this.value ?? this.min) <= this.min;
  }

  protected isMaxDisabled(): boolean {
    return (
      this.disabled ||
      this.max === 0 ||
      (!!this.max && !!this.value && this.value >= this.max)
    );
  }

  /**
   * Increases the input value by a single step
   * and triggers the change event.
   *
   * The step is configurable.
   */
  protected increase(): void {
    this.input?.stepUp();
    this.onChange();
  }

  /**
   * Decreases the input value by a single step
   * and triggers the change event.
   *
   * The step is configurable.
   */
  protected decrease(): void {
    this.input?.stepDown();
    this.onChange();
  }

  /**
   * Updates the value.
   *
   * Triggers validity reporting so that native browser validation appears.
   */
  protected onInput(e: InputEvent): void {
    this.updateValue((e.target as HTMLInputElement).value);
    this.dispatch(UPDATE_EVENT);
  }

  /**
   * Dispatches an update event
   */
  protected onChange(): void {
    this.updateValue();
    if (this.submitOnChange && this.input?.validity.valid) {
      this.dispatch(SUBMIT_EVENT);
    } else {
      this.dispatch(UPDATE_EVENT);
    }
  }

  protected updateValue(value?: string): void {
    this.value = Number(value ?? this.input?.value);
    this.checkValidity();
  }

  protected checkValidity(): void {
    this.hasError = !this.input?.reportValidity();
  }

  /**
   * Dispatches a submit event when the Enter key is triggered
   * and the input is valid.
   *
   * When the input is invalid, we'll trigger a report on the validity
   * so that the user understands why the input is not submitted.
   */
  protected onKeydown(ev: KeyboardEvent): void {
    if (ev.key !== 'Enter') {
      return;
    }
    if (this.input?.validity.valid) {
      this.dispatch(SUBMIT_EVENT);
    } else {
      this.checkValidity();
    }
  }

  protected dispatch<T extends QuantityEventDetail>(
    eventName: typeof UPDATE_EVENT | typeof SUBMIT_EVENT
  ): void {
    const detail = { quantity: Number(this.input?.value) } as T;
    if (!this.input?.validity.valid) {
      detail.isInvalid = true;
    }
    this.dispatchEvent(
      new CustomEvent<T>(eventName, { detail, bubbles: true, composed: true })
    );
  }

  protected get input(): HTMLInputElement | undefined {
    return this.inputRef.value;
  }
}
