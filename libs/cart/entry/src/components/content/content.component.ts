import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { ComponentMixin } from '@spryker-oryx/experience';
import { html, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, Ref, ref } from 'lit/directives/ref.js';
import {
  CartEntryCompositionOptions,
  RemoveByQuantity,
} from '../../entry.model';
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

  protected getDecreaseIcon(): string | undefined {
    return this.options?.removeByQuantity === RemoveByQuantity.ShowBin &&
      this.options?.quantity === 1
      ? 'trash'
      : undefined;
  }

  protected render(): TemplateResult {
    return html`
      <product-title .options=${{ link: true }}></product-title>

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

          <cart-entry-price
            .price="${this.options?.calculations?.unitPrice}"
            ?loading="${this.options?.updating}"
          >
            <!-- TODO: replace by tooltip -->
            <oryx-icon type="inputError"></oryx-icon>
            Price
          </cart-entry-price>
        </div>

        <div class="col">
          <quantity-input
            ${ref(this.quantityInputRef)}
            min=${!this.options?.removeByQuantity ? 1 : 0}
            .value=${this.options?.quantity}
            ?disabled=${this.disabled || this.options?.disabled}
            decrease-icon=${ifDefined(this.getDecreaseIcon())}
          ></quantity-input>

          <cart-entry-price
            .price="${this.options?.calculations?.sumPrice}"
            ?loading="${this.options?.updating}"
          >
            Subtotal
          </cart-entry-price>
        </div>
      </section>
    `;
  }
}
