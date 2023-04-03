import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { Size } from '@spryker-oryx/ui';
import { ButtonType } from '@spryker-oryx/ui/button';
import { computed, hydratable, i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { take } from 'rxjs';
import { CartAddOptions } from './add.model';
import { styles } from './add.styles';

@hydratable(['mouseover', 'focusin'])
export class CartAddComponent extends ProductMixin(
  CartComponentMixin(ContentMixin<CartAddOptions>(LitElement))
) {
  static styles = styles;

  @state() protected confirmed = false;
  @state() protected isInvalid = false;

  protected cartService = resolve(CartService);

  protected override render(): TemplateResult | void {
    if (!this.$product()?.sku) return;
    if (this.$options().hideQuantityInput) {
      return this.renderButton();
    }
    return html`${this.renderQuantity()} ${this.renderButton()}`;
  }

  protected renderQuantity(): TemplateResult | void {
    return html`<oryx-cart-quantity-input
      .min=${this.min()}
      .max=${this.max()}
      @update=${this.onUpdate}
      @submit=${this.onSubmit}
    ></oryx-cart-quantity-input>`;
  }

  protected renderButton(): TemplateResult | void {
    return html` <oryx-button
      size=${Size.Sm}
      type=${ButtonType.Primary}
      ?loading=${this.$isBusy()}
      ?outline=${this.$options().outlined}
      ?confirmed=${this.confirmed}
    >
      <button
        ?disabled=${this.isInvalid || this.max() < this.min()}
        @click=${this.onSubmit}
      >
        <oryx-icon .type=${IconTypes.CartAdd} size=${Size.Lg}></oryx-icon>
        ${i18n('cart.add-to-cart')}
      </button>
    </oryx-button>`;
  }

  protected min = computed(() => {
    const value = 1;
    if (this.$product()) {
      const el = this.shadowRoot
        ?.querySelector<QuantityInputComponent>('oryx-cart-quantity-input')
        ?.reset();
    }
    return value;
  });

  protected max = computed(() => {
    const qty = this.$product()?.availability?.quantity;
    return qty
      ? qty -
          this.$entries()
            .filter((entry) => entry.sku === this.$product()?.sku)
            .map((entry) => entry.quantity)
            .reduce((a: number, b) => a + b, 0)
      : 0;
  });

  protected onUpdate(e: CustomEvent<QuantityEventDetail>): void {
    this.isInvalid = !!e.detail.isInvalid;
  }

  protected onSubmit(e: Event | CustomEvent<QuantityEventDetail>): void {
    e.preventDefault();
    const sku = this.$product()?.sku;
    if (!sku) return;

    const quantity =
      (e as CustomEvent).detail?.quantity ??
      this.shadowRoot?.querySelector<QuantityInputComponent>(
        'oryx-cart-quantity-input'
      )?.value ??
      this.min();

    this.cartService
      .addEntry({ sku, quantity })
      .pipe(take(1))
      .subscribe(() => {
        this.confirmed = true;
        setTimeout(() => (this.confirmed = false), 800);
      });
  }
}
