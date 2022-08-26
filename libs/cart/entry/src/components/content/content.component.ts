import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { ComponentMixin } from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import { CartEntryCompositionOptions } from '../../entry.model';
import { cartEntryContentStyles } from './content.styles';

export class CartEntryContentComponent extends ComponentMixin<CartEntryCompositionOptions>() {
  static styles = cartEntryContentStyles;

  @property({ type: Boolean }) disabled?: boolean;

  protected quantityInputRef: Ref<QuantityInputComponent> = createRef();

  protected updated(): void {
    //align quantity and input's value
    if (
      !this.options?.confirmationRequired &&
      this.quantityInputRef.value?.value !== this.options?.quantity
    ) {
      (this.quantityInputRef.value as QuantityInputComponent).value = this
        .options?.quantity as number;
    }
  }

  protected render(): TemplateResult {
    return html`
      <h3>
        <product-title></product-title>
      </h3>

      <product-id></product-id>

      <!-- TODO: adjust seller's section -->
      <div class="seller">
        <span>Sold by</span>
        <span>Spryker</span>
      </div>

      <section>
        <div class="col">
          <!-- TODO: replace by product configuration -->
          <span>Product config section</span>

          <cart-entry-price .price=${this.options?.calculations?.unitPrice}>
            <!-- TODO: replace by tooltip -->
            <oryx-icon type="inputError"></oryx-icon>
            Price
          </cart-entry-price>
        </div>

        <div class="col">
          <quantity-input
            ${ref(this.quantityInputRef)}
            min=${0}
            .value=${this.options?.quantity}
            ?disabled=${this.disabled}
          ></quantity-input>

          <cart-entry-price .price=${this.options?.calculations?.sumPrice}>
            Subtotal
          </cart-entry-price>
        </div>
      </section>
    `;
  }
}
