import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { ButtonComponent, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  computed,
  effect,
  elementEffect,
  hydratable,
  i18n,
  signal,
  Size,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { query, state } from 'lit/decorators.js';
import { CartAddOptions } from './add.model';
import { styles } from './add.styles';

@hydratable(['mouseover', 'focusin'])
export class CartAddComponent extends ProductMixin(
  CartComponentMixin(ContentMixin<CartAddOptions>(LitElement))
) {
  static styles = styles;

  protected cartService = resolve(CartService);

  @state() protected isInvalid = false;
  protected isInvalid2 = signal(false);
  @query('oryx-button') protected button?: ButtonComponent;
  @query('oryx-cart-quantity-input') protected input?: QuantityInputComponent;

  protected override render(): TemplateResult | void {
    if (!this.$product()?.sku) return;
    if (this.$options().hideQuantityInput) {
      return this.renderButton();
    }
    return html`${this.renderQuantity()} ${this.renderButton()}`;
  }

  protected renderQuantity(): TemplateResult | void {
    return html`<oryx-cart-quantity-input
      .min=${this.$min()}
      .max=${this.$max()}
      @update=${this.onUpdate}
      @submit=${this.onSubmit}
    ></oryx-cart-quantity-input>`;
  }

  protected renderButton(): TemplateResult | void {
    return html`<oryx-button
      size=${Size.Sm}
      type=${ButtonType.Primary}
      ?outline=${this.$options().outlined}
    >
      <button
        ?disabled=${this.isInvalid || this.$hasStock()}
        @click=${this.onSubmit}
      >
        <oryx-icon .type=${IconTypes.CartAdd} size=${Size.Lg}></oryx-icon>
        ${i18n('cart.add-to-cart')}
      </button>
    </oryx-button>`;
  }

  @elementEffect()
  protected reset = effect(() => {
    if (this.$product()) this.input?.reset?.();
  });

  protected $hasStock = computed(() => {
    return (
      !this.$product()?.availability?.isNeverOutOfStock &&
      this.$max() < this.$min()
    );
  });

  protected $min = computed(() => {
    return 1;
  });

  protected $max = computed(() => {
    const qty = this.$product()?.availability?.quantity;
    const sku = this.$product()?.sku;
    return qty
      ? qty -
          this.$entries()
            .filter((entry) => entry.sku === sku)
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
    if (!sku || !this.button) return;

    const quantity =
      (e as CustomEvent).detail?.quantity ?? this.input?.value ?? this.$min();
    const button = this.button;

    this.button.loading = true;
    this.cartService.addEntry({ sku, quantity }).subscribe({
      next: () => {
        button.confirmed = true;
        setTimeout(() => {
          button.confirmed = false;
        }, 800);
      },
      error: () => {
        button.confirmed = false;
      },
      complete: () => {
        button.loading = false;
      },
    });
  }
}
