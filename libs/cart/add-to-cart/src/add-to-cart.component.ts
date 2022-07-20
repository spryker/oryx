import { CartService } from '@spryker-oryx/cart';
import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { hydratable } from '@spryker-oryx/core';
import { ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import {
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { wait } from '@spryker-oryx/typescript-utils';
import { ButtonType } from '@spryker-oryx/ui/button';
import { MiscIcons } from '@spryker-oryx/ui/icon';
import { Size } from '@spryker-oryx/ui/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, combineLatest } from 'rxjs';
import '../../quantity-input';
import { AddToCartOptions } from './add-to-cart.model';
import { styles } from './add-to-cart.styles';

@hydratable('mouseover')
export class AddToCartComponent extends ProductComponentMixin<AddToCartOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected product$ = new ProductController(this).getProduct();

  protected loading$ = new BehaviorSubject(false);
  protected showSuccessButton$ = new BehaviorSubject(false);
  protected cartService = resolve(CartService);
  protected options$ = combineLatest([
    this.contentController.getOptions(),
    this.loading$,
    this.product$,
    this.showSuccessButton$,
  ]);
  protected quantity = 1;

  protected onSubmit(
    e: Event,
    hideQuantityInput: boolean | undefined,
    sku: string | undefined
  ): void {
    e.preventDefault();

    if ((!hideQuantityInput && !this.isValidQuantity()) || !sku) {
      return;
    }

    this.loading$.next(true);

    this.cartService
      .addEntry({
        sku,
        quantity: hideQuantityInput ? 1 : this.quantity,
      })
      .subscribe({
        next: async () => {
          this.loading$.next(false);

          this.showSuccessButton$.next(true);
          await wait(800);
          this.showSuccessButton$.next(false);
        },
        error: async () => {
          this.loading$.next(false);
        },
      });
  }

  protected isValidQuantity(): boolean {
    const quantityInput = this.shadowRoot?.querySelector(
      'quantity-input'
    ) as QuantityInputComponent;
    return quantityInput.validate();
  }

  protected setQuantity({
    detail: { quantity },
  }: {
    detail: { quantity: number };
  }): void {
    this.quantity = quantity;
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.options$,
        ([option, loading, product, showSuccessButton]) => html`
          <form
            @submit=${(e: Event): void =>
              this.onSubmit(e, option.hideQuantityInput, product?.sku)}
          >
            ${when(
              !option.hideQuantityInput,
              () => html`
                <quantity-input
                  value=${this.quantity}
                  ?disabled=${option.disabled}
                  @update=${this.setQuantity}
                ></quantity-input>
              `
            )}
            <oryx-button
              icon
              size=${Size.small}
              ?loading=${loading}
              type=${ButtonType.Primary}
              ?outline=${showSuccessButton}
            >
              <button ?disabled=${option.disabled} ?inert=${showSuccessButton}>
                <oryx-icon
                  type=${showSuccessButton ? MiscIcons.Mark : MiscIcons.CartAdd}
                  size=${Size.large}
                ></oryx-icon>
                ${showSuccessButton ? '' : 'Add to Cart'}
              </button>
            </oryx-button>
          </form>
        `
      )}
    `;
  }
}
