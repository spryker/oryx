import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductMixin } from '@spryker-oryx/product';
import { ButtonComponent, ButtonType } from '@spryker-oryx/ui/button';
import { IconTypes } from '@spryker-oryx/ui/icon';
import {
  Size,
  computed,
  elementEffect,
  hydrate,
} from '@spryker-oryx/utilities';
import { LitElement, TemplateResult, html } from 'lit';
import { query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { CartAddOptions } from './add.model';
import { styles } from './add.styles';

@defaultOptions({
  enableLabel: true,
})
@hydrate({ event: ['mouseover', 'focusin'] })
export class CartAddComponent extends ProductMixin(
  CartComponentMixin(ContentMixin<CartAddOptions>(LitElement))
) {
  static styles = styles;

  protected cartService = resolve(CartService);

  @state() protected isInvalid = false;
  @query('oryx-button') protected button?: ButtonComponent;
  @query('oryx-cart-quantity-input') protected input?: QuantityInputComponent;

  protected override render(): TemplateResult | void {
    if (!this.$product()?.sku) return;
    return html`${this.renderQuantity()} ${this.renderButton()}`;
  }

  protected renderQuantity(): TemplateResult | void {
    if (this.$options().hideQuantityInput) return;

    return html`<oryx-cart-quantity-input
      .min=${this.$min()}
      .max=${this.$max()}
      @update=${this.onUpdate}
      @submit=${this.onSubmit}
    ></oryx-cart-quantity-input>`;
  }

  protected renderButton(): TemplateResult | void {
    const { outlined, enableLabel } = this.$options();
    const type = outlined ? ButtonType.Outline : ButtonType.Solid;
    const text = this.i18n('cart.add-to-cart') as string;

    return html`<oryx-button
      size=${Size.Md}
      type=${type}
      text=${ifDefined(enableLabel ? text : undefined)}
      label=${ifDefined(enableLabel ? undefined : text)}
      icon=${IconTypes.CartAdd}
      ?block=${this.$options().hideQuantityInput}
      ?disabled=${this.isInvalid || !this.$hasStock()}
      @click=${this.onSubmit}
      @mouseup=${this.onMouseUp}
    ></oryx-button>`;
  }

  protected onMouseUp(e: Event): void {
    e.stopPropagation();
  }

  @elementEffect()
  protected reset = (): void => {
    if (this.$product()) this.input?.reset?.();
  };

  protected $hasStock = computed(() => {
    return (
      this.$product()?.availability?.isNeverOutOfStock ||
      (this.$max() && this.$max() >= this.$min())
    );
  });

  protected $min = computed(() => {
    return this.$product()?.availability?.isNeverOutOfStock || this.$max()
      ? 1
      : 0;
  });

  protected $max = computed(() => {
    const { availability, sku } = this.$product() ?? {};

    if (availability?.isNeverOutOfStock) return Infinity;
    if (availability?.quantity)
      return (
        availability?.quantity -
        this.$entries()
          .filter((entry) => entry.sku === sku)
          .map((entry) => entry.quantity)
          .reduce((a: number, b) => a + b, 0)
      );
    return 0;
  });

  protected onUpdate(e: CustomEvent<QuantityEventDetail>): void {
    this.isInvalid = !!e.detail.isInvalid;
  }

  protected onSubmit(e: Event | CustomEvent<QuantityEventDetail>): void {
    e.preventDefault();
    e.stopPropagation();
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
      error: (e) => {
        button.confirmed = false;
        button.loading = false;
        throw e;
      },
      complete: () => {
        button.loading = false;
      },
    });
  }
}
