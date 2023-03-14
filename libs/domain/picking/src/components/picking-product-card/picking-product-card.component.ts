import { i18n } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { PickingListItem } from '../../models';
import { styles } from './picking-product-card.styles';

export class PickingProductCardComponent extends LitElement {
  static styles = styles;

  @property() productItem?: PickingListItem;

  @state() isCorrectNumberOfPickedProvided?: boolean;
  @state() isConfirmPickingDialogOpen = false;
  @state() isEditStatus = false;

  protected productImage(image: string | null | undefined): string {
    return image || '/img/image-placeholder.svg';
  }

  protected override render(): TemplateResult {
    return html`${this.renderPickingProduct()} ${this.renderConfirmationModal()}`;
  }

  protected renderPickingProduct(): TemplateResult {
    return html`
      ${when(
        this.productItem,
        () => html`
          <oryx-card>
            <div slot="heading">${this.productItem?.orderItem?.name}</div>
            <div class="subtitle">
              <span>${this.productItem?.orderItem.sku}</span>
            </div>

            <img
              src="${this.productImage(this.productItem?.product?.image)}"
              alt="${ifDefined(this.productItem?.orderItem?.name)}"
              class="image"
            />

            ${when(
              !this.isEditStatus,
              () => html`
                <form v-if="isEditStatus" class="edit-quantity">
                  <oryx-cart-quantity-input
                    ref="numberOfPickedInput"
                    min="0"
                    .max="${this.productItem?.quantity}"
                    .value="${this.productItem?.numberOfPicked}"
                  ></oryx-cart-quantity-input>

                  <div class="edit-quantity-info">
                    <span
                      >${i18n('picking.product-card.of')}
                      ${this.productItem?.quantity}
                      ${i18n('picking.product-card.items')}</span
                    >
                  </div>

                  <oryx-button>
                    <button
                      type="submit"
                      ?disabled="${this.isCorrectNumberOfPickedProvided}"
                    >
                      <oryx-icon type="checkMark"></oryx-icon>
                      ${i18n('picking.product-card.done')}
                    </button>
                  </oryx-button>
                </form>
              `,
              () => html` <div class="summary-info">
                  <p>{{ summaryInfo.main }}</p>
                  <p v-if="summaryInfo.additional">
                    {{ summaryInfo.additional }}
                  </p>
                </div>

                <oryx-button>
                  <button>
                    <oryx-icon type="edit"></oryx-icon>
                    ${i18n('picking.product-card.edit-items')}
                  </button>
                </oryx-button>`
            )}
          </oryx-card>
        `
      )}
    `;
  }

  protected renderConfirmationModal(): TemplateResult {
    return html`
      <oryx-modal ?open=${this.isConfirmPickingDialogOpen} enableFooter>
        <oryx-heading slot="heading">
          <h2>${i18n('picking.product-card.confirm-picking')}</h2>
        </oryx-heading>

        <span>
          You only picked
          <span class="bold-text"
            >${this.productItem?.numberOfPicked}} out of
            ${this.productItem?.quantity}</span
          >
          items. Do you really want to complete the pick?
        </span>

        <div slot="footer">
          <oryx-button
            :type="cancelBtnType"
            :size="buttonSize"
            class="dialog-modal__button"
            outline="true"
          >
            <button>${i18n('picking.product-card.cancel')}</button>
          </oryx-button>

          <oryx-button
            :type="confirmBtnType"
            :size="buttonSize"
            class="dialog-modal__button"
          >
            <button>${i18n('picking.product-card.confirm')}</button>
          </oryx-button>
        </div>
      </oryx-modal>
    `;
  }
}
