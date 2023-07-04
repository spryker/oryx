import { QuantityInputComponent } from '@spryker-oryx/cart/quantity-input';
import {
  EVENT_EDIT,
  EVENT_SUBMIT,
  ItemsFilters,
  PickingListItem,
  ProductItemPickedEvent,
} from '@spryker-oryx/picking';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { createRef, ref, Ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';
import { pickingProductCardComponentStyles } from './picking-product-card.styles';

export class PickingProductCardComponent extends LitElement {
  static styles = pickingProductCardComponentStyles;

  @property() productItem?: PickingListItem;
  @property() status?: string;

  @state() isCorrectNumberOfPickedProvided = true;
  @state() currentNumberOfPicked?: number;

  protected quantityInputRef: Ref<QuantityInputComponent> = createRef();

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

    this.currentNumberOfPicked =
      this.currentNumberOfPicked ?? this.productItem?.numberOfPicked;

    this.dispatchPickingEvents(EVENT_SUBMIT, {
      productId: this.productItem!.id,
      numberOfPicked: this.currentNumberOfPicked,
    });
  }

  protected editProductPicking(): void {
    this.dispatchPickingEvents(EVENT_EDIT, {
      productId: this.productItem!.id,
    } as ProductItemPickedEvent);
  }

  protected onChangeQuantity({ detail: { quantity } }: CustomEvent): void {
    this.currentNumberOfPicked = quantity;

    if (this.productItem && this.currentNumberOfPicked) {
      this.isCorrectNumberOfPickedProvided =
        0 <= this.currentNumberOfPicked &&
        this.currentNumberOfPicked <= this.productItem.quantity;
    }
  }

  protected dispatchPickingEvents(
    event: string,
    productItem?: ProductItemPickedEvent
  ): void {
    this.dispatchEvent(
      new CustomEvent(event, {
        bubbles: true,
        composed: true,
        detail: productItem,
      })
    );
  }

  public focusOnQuantityInput(): void {
    setTimeout(() => {
      this.quantityInputRef.value?.focus();
    }, 0);
  }

  protected override render(): TemplateResult {
    return html`${this.renderPickingProduct()}`;
  }

  protected renderPickingProduct(): TemplateResult {
    if (!this.productItem) {
      return html``;
    }

    const quantityForm = html`
      <form @submit=${this.onSubmit}>
        <oryx-cart-quantity-input
          ${ref(this.quantityInputRef)}
          min="0"
          .max="${this.productItem.quantity}"
          .value="${this.productItem.numberOfPicked}"
          @update=${this.onChangeQuantity}
        ></oryx-cart-quantity-input>

        <div>
          ${i18n('picking.product-card.of-<count>-items', {
            count: this.productItem.quantity,
          })}
        </div>

        <oryx-button>
          <button ?disabled="${!this.isCorrectNumberOfPickedProvided}">
            <oryx-icon .type=${IconTypes.Check}></oryx-icon>
            ${i18n('picking.product-card.done')}
          </button>
        </oryx-button>
      </form>
    `;

    return html`
      <oryx-card>
        <oryx-heading slot="heading">
          ${this.productItem.orderItem.name}
        </oryx-heading>
        <oryx-heading>
          <h6>${this.productItem.orderItem.sku}</h6>
        </oryx-heading>

        <oryx-image
          .src="${this.productItem.product.image}"
          alt="${ifDefined(this.productItem.orderItem.name)}"
          class="${classMap({
            'image-fade': this.status === ItemsFilters.NotFound,
          })}"
        ></oryx-image>

        ${when(
          this.status === ItemsFilters.NotPicked,
          () => quantityForm,
          () => this.renderEditStatus()
        )}
      </oryx-card>
    `;
  }

  protected renderEditStatus(): TemplateResult {
    let text = '';
    let label = '';
    let subtext = '';

    if (!this.productItem) {
      return html``;
    }

    if (this.status === ItemsFilters.Picked) {
      text = `${this.productItem.numberOfPicked}/${this.productItem.quantity}`;

      if (this.productItem.numberOfPicked < this.productItem.quantity) {
        label = i18n('picking.product-card.items-picked') as string;
      } else {
        subtext = i18n('picking.product-card.all-items-picked') as string;
      }
    } else if (this.status === ItemsFilters.NotFound) {
      text = `${this.productItem.numberOfNotPicked}/${this.productItem.quantity}`;

      if (this.productItem.numberOfNotPicked < this.productItem.quantity) {
        label = i18n('picking.product-card.items-not-found') as string;
      } else {
        subtext = i18n('picking.product-card.no-items-found') as string;
      }
    }

    return html`
      <div class="summary-info">
        <p>${text} ${label}</p>
        ${when(subtext, () => html`<p>${subtext}</p>`)}
      </div>
      <oryx-button>
        <button @click=${this.editProductPicking}>
          <oryx-icon .type=${IconTypes.Edit}></oryx-icon>
          ${i18n('picking.product-card.edit-items')}
        </button>
      </oryx-button>
    `;
  }
}
