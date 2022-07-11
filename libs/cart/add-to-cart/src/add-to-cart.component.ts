import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import { ContentController } from '@spryker-oryx/experience';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { ProductComponentMixin } from '@spryker-oryx/product';
import { Size } from '@spryker-oryx/ui/utilities';
import { html, TemplateResult } from 'lit';
import { when } from 'lit/directives/when.js';
import '../../quantity-input';
import { AddToCartOptions } from './add-to-cart.model';
import { styles } from './add-to-cart.styles';

export class AddToCartComponent extends ProductComponentMixin<AddToCartOptions>() {
  static styles = styles;

  protected contentController = new ContentController(this);
  protected options$ = this.contentController.getOptions();

  protected onSubmit(e: Event, hideQuantityInput: boolean | undefined): void {
    e.preventDefault();

    if (!hideQuantityInput) {
      this.isValidQuantity();
    }

    //TODO: call AddToCartService method that will add the product to the cart
  }

  protected isValidQuantity(): boolean {
    const quantityInput = this.shadowRoot?.querySelector(
      'quantity-input'
    ) as QuantityInputComponent;
    return quantityInput.validate();
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.options$,
        (option) => html`
          <form
            @submit=${(e: Event): void =>
              this.onSubmit(e, option.hideQuantityInput)}
          >
            ${when(
              !option.hideQuantityInput,
              () => html`
                <quantity-input ?disabled=${option.loading}></quantity-input>
              `
            )}
            <oryx-button icon size=${Size.small} ?loading=${option.loading}>
              <button>
                <!--TODO: change hardcoded type on enum when it will be available in UI lib -->
                <oryx-icon type="cart-add" size=${Size.large}></oryx-icon>
                Add to Cart
              </button>
            </oryx-button>
          </form>
        `
      )}
    `;
  }
}
