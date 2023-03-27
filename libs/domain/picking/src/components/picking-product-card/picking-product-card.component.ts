import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { classMap } from 'lit-html/directives/class-map.js';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import {
  EVENT_EDIT,
  EVENT_SUBMIT,
  ItemsFilters,
  PickingListItem,
  ProductItemPickedEvent,
  SummaryInfo,
} from '../../models';
import { styles } from './picking-product-card.styles';

export class PickingProductCardComponent extends LitElement {
  static styles = styles;

  @property() productItem?: PickingListItem;
  @property() status?: string;

  @state() isCorrectNumberOfPickedProvided = true;
  @state() currentNumberOfPicked?: number;

  protected summaryInfo: SummaryInfo | undefined;

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

    this.currentNumberOfPicked =
      this.currentNumberOfPicked ?? this.productItem?.numberOfPicked;

    if (this.productItem?.product.id) {
      this.dispatchPickingEvents(EVENT_SUBMIT, {
        productId: this.productItem.product.id,
        numberOfPicked: this.currentNumberOfPicked,
      });
    }
  }

  protected editProductPicking(): void {
    this.dispatchPickingEvents(EVENT_EDIT, {
      productId: this.productItem?.product.id,
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

  protected getSummaryInfo(): SummaryInfo {
    if (!this.productItem) {
      return {
        main: '',
      };
    }

    if (this.status === ItemsFilters.Picked) {
      const template = `${this.productItem.numberOfPicked}/${this.productItem.quantity}`;

      if (this.productItem.numberOfPicked < this.productItem.quantity) {
        return {
          main: `${template} ${i18n('picking.product-card.items-picked')}`,
        };
      }

      return {
        main: template,
        additional: `${i18n('picking.product-card.all-items-picked')}`,
      };
    } else if (this.status === ItemsFilters.NotFound) {
      const template = `${this.productItem.numberOfNotPicked}/${this.productItem.quantity}`;

      if (this.productItem.numberOfNotPicked < this.productItem.quantity) {
        return {
          main: `${template} ${i18n('picking.product-card.items-not-found')}`,
        };
      }

      return {
        main: template,
        additional: `${i18n('picking.product-card.no-items-found')}`,
      };
    }

    return {
      main: '',
    };
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

  protected override render(): TemplateResult {
    return html`${this.renderPickingProduct()}`;
  }

  protected renderPickingProduct(): TemplateResult {
    return html`
      ${when(
        this.productItem,
        () => html`
          <oryx-card>
            ${when(
              this.productItem?.orderItem,
              () =>
                html`
                  <oryx-heading slot="heading"
                    >${this.productItem?.orderItem.name}
                  </oryx-heading>
                  <div class="subtitle">${this.productItem?.orderItem.sku}</div>
                `
            )}

            <oryx-image
              .src="${this.productItem?.product?.image}"
              alt="${ifDefined(this.productItem?.orderItem?.name)}"
              class="${classMap({
                'image-fade': this.status === ItemsFilters.NotFound,
              })}"
            ></oryx-image>

            ${when(
              this.status === ItemsFilters.NotPicked,
              () => html`
                <form @submit=${this.onSubmit}>
                  <oryx-cart-quantity-input
                    min="0"
                    .max="${this.productItem?.quantity}"
                    .value="${this.productItem?.numberOfPicked}"
                    @update=${this.onChangeQuantity}
                  ></oryx-cart-quantity-input>

                  <div>
                    ${i18n('picking.product-card.of')}
                    ${this.productItem?.quantity}
                    ${i18n('picking.product-card.items')}
                  </div>

                  <oryx-button>
                    <button
                      ?disabled="${!this.isCorrectNumberOfPickedProvided}"
                    >
                      <oryx-icon type="checkMark"></oryx-icon>
                      ${i18n('picking.product-card.done')}
                    </button>
                  </oryx-button>
                </form>
              `,
              () => this.renderEditStatus()
            )}
          </oryx-card>
        `
      )}
    `;
  }

  protected renderEditStatus(): TemplateResult {
    this.summaryInfo = this.getSummaryInfo();

    return html` <div class="summary-info">
        <p>${this.summaryInfo?.main}</p>
        <p>${this.summaryInfo?.additional}</p>
      </div>

      <oryx-button>
        <button @click=${this.editProductPicking}>
          <oryx-icon type="edit"></oryx-icon>
          ${i18n('picking.product-card.edit-items')}
        </button>
      </oryx-button>`;
  }
}
