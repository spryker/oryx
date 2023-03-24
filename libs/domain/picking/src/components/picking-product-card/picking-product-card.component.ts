import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject } from 'rxjs';
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

  @state() isCorrectNumberOfPickedProvided?: boolean = true;

  @state() currentNumberOfPicked = this.productItem?.numberOfPicked ?? 0;

  @state() pickedDataEvent?: ProductItemPickedEvent;

  protected isConfirmPickingDialogOpen$ = new BehaviorSubject(false);
  @asyncState()
  protected isConfirmPickingDialogOpen = valueType(
    this.isConfirmPickingDialogOpen$
  );

  protected summaryInfo: SummaryInfo | undefined;

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

    if (this.currentNumberOfPicked === this.productItem?.quantity) {
      this.dispatchPickingEvents(EVENT_SUBMIT, this.pickedDataEvent);
    } else {
      this.isConfirmPickingDialogOpen$.next(true);
    }
  }

  protected confirmPartialPicking(): void {
    this.dispatchPickingEvents(EVENT_SUBMIT, {
      productId: this.productItem?.product.id,
      numberOfPicked: this.currentNumberOfPicked,
    } as ProductItemPickedEvent);

    this.isConfirmPickingDialogOpen$.next(false);
  }

  protected editProductPicking(): void {
    this.dispatchPickingEvents(EVENT_EDIT, {
      productId: this.productItem?.product.id,
    } as ProductItemPickedEvent);
  }

  protected onModalClose(): void {
    this.isConfirmPickingDialogOpen$.next(false);
  }

  protected onChangeQuantity({ detail: { quantity } }: CustomEvent): void {
    this.currentNumberOfPicked = quantity;

    if (this.productItem) {
      this.isCorrectNumberOfPickedProvided =
        0 <= this.currentNumberOfPicked &&
        this.currentNumberOfPicked <= this.productItem.quantity;

      this.pickedDataEvent = {
        productId: this.productItem?.product.id,
        numberOfPicked: this.currentNumberOfPicked,
      };
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
    return html`${this.renderPickingProduct()} ${this.renderConfirmationModal()}`;
  }

  protected renderPickingProduct(): TemplateResult {
    return html`
      ${when(
        this.productItem,
        () => html`
          <oryx-card>
            <oryx-heading slot="heading" class="title">
              ${this.productItem?.orderItem?.name}
            </oryx-heading>
            <div class="subtitle">${this.productItem?.orderItem.sku}</div>

            <oryx-image
              .src="${this.productItem?.product?.image}"
              alt="${ifDefined(this.productItem?.orderItem?.name)}"
              class="${this.status === ItemsFilters.NotFound
                ? 'image-fade'
                : ''}"
            ></oryx-image>

            ${when(
              this.status === ItemsFilters.NotPicked,
              () => html`
                <form class="edit-quantity" @submit=${this.onSubmit}>
                  <oryx-cart-quantity-input
                    ref="numberOfPickedInput"
                    min="0"
                    .max="${this.productItem?.quantity}"
                    .value="${this.currentNumberOfPicked}"
                    @update=${this.onChangeQuantity}
                  ></oryx-cart-quantity-input>

                  <div class="edit-quantity-info">
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

  protected renderConfirmationModal(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.isConfirmPickingDialogOpen}
        enableFooter
        preventclosebybackdrop
        @oryx.close=${this.onModalClose}
      >
        <div slot="heading">
          ${i18n('picking.product-card.confirm-picking')}
        </div>

        <span>
          You only picked
          <span class="bold-text"
            >${this.currentNumberOfPicked} out of
            ${this.productItem?.quantity}</span
          >
          items. Do you really want to complete the pick?
        </span>

        <div slot="footer">
          <oryx-button outline type="secondary">
            <button @click=${this.onModalClose}>
              ${i18n('picking.product-card.cancel')}
            </button>
          </oryx-button>

          <oryx-button type="primary">
            <button @click=${this.confirmPartialPicking}>
              ${i18n('picking.product-card.confirm')}
            </button>
          </oryx-button>
        </div>
      </oryx-modal>
    `;
  }
}
