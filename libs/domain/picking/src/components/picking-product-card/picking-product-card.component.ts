import { asyncState, i18n, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import { property, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { ItemsFilters, PickingListItem, SummaryInfo } from '../../models';
import { styles } from './picking-product-card.styles';

export const EVENT_CHANGE_NUMBER_OF_PICKED = 'oryx.change-number-of-picked';
export const EVENT_SUBMIT = 'oryx.submit';
export const EVENT_EDIT = 'oryx.edit';

export class PickingProductCardComponent extends LitElement {
  static styles = styles;

  @property() productItem?: PickingListItem;
  @property() status: string = ItemsFilters.Picked;

  @state() isCorrectNumberOfPickedProvided?: boolean;

  protected currentNumberOfPicked$ = new BehaviorSubject(0);
  @asyncState()
  protected currentNumberOfPicked = valueType(this.currentNumberOfPicked$);

  protected isConfirmPickingDialogOpen$ = new BehaviorSubject(false);
  @asyncState()
  protected isConfirmPickingDialogOpen = valueType(
    this.isConfirmPickingDialogOpen$
  );

  @asyncState() protected summaryInfo: SummaryInfo | undefined = valueType(
    this.getSummaryInfo()
  );

  protected productImage(image: string | null | undefined): string {
    return image || '/img/image-placeholder.svg';
  }

  protected onSubmit(e: SubmitEvent): void {
    e.preventDefault();

    if (this.productItem?.numberOfPicked === this.productItem?.quantity) {
      this.dispatchEvent(
        new CustomEvent(EVENT_SUBMIT, {
          bubbles: true,
          composed: true,
        })
      );
    } else {
      this.isConfirmPickingDialogOpen$.next(true);
    }
  }

  protected confirmPartialPicking(): void {
    this.dispatchEvent(
      new CustomEvent(EVENT_CHANGE_NUMBER_OF_PICKED, {
        bubbles: true,
        composed: true,
        detail: {
          numberOfPicked: this.currentNumberOfPicked,
        },
      })
    );

    this.dispatchEvent(
      new CustomEvent(EVENT_SUBMIT, {
        bubbles: true,
        composed: true,
      })
    );

    this.isConfirmPickingDialogOpen$.next(false);
  }

  protected editProductPicking(): void {
    this.dispatchEvent(
      new CustomEvent(EVENT_EDIT, {
        bubbles: true,
        composed: true,
      })
    );
  }

  protected onModalClose(): void {
    this.isConfirmPickingDialogOpen$.next(false);
  }

  protected onChangeQuantity({ detail: { quantity } }: CustomEvent): void {
    this.currentNumberOfPicked$.next(quantity);

    new CustomEvent(EVENT_CHANGE_NUMBER_OF_PICKED, {
      bubbles: true,
      composed: true,
      detail: {
        numberOfPicked: this.currentNumberOfPicked,
      },
    });
  }

  protected getSummaryInfo(): Observable<SummaryInfo> {
    if (!this.productItem?.numberOfNotPicked || !this.productItem?.quantity) {
      return of({
        main: '',
      });
    }

    if (this.status === ItemsFilters.Picked) {
      const template = `${this.productItem?.numberOfPicked}/${this.productItem?.quantity}`;

      if (this.productItem?.numberOfPicked < this.productItem?.quantity) {
        return of({ main: `${template} items picked` });
      }

      return of({
        main: template,
        additional: 'All items picked',
      });
    } else if (this.status === ItemsFilters.NotFound) {
      const template = `${this.productItem?.numberOfNotPicked}/${this.productItem?.quantity}`;

      if (this.productItem?.numberOfNotPicked < this.productItem?.quantity) {
        return of({ main: `${template} items not found` });
      }

      return of({
        main: template,
        additional: 'No items found',
      });
    }

    return of({
      main: '',
    });
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
            <div slot="heading" class="title">
              ${this.productItem?.orderItem?.name}
            </div>
            <div class="subtitle">
              <span>${this.productItem?.orderItem.sku}</span>
            </div>

            <img
              src="${this.productImage(this.productItem?.product?.image)}"
              alt="${ifDefined(this.productItem?.orderItem?.name)}"
              class="image"
            />

            ${when(
              this.status === ItemsFilters.NotPicked,
              () => html`
                <form class="edit-quantity" @submit=${this.onSubmit}>
                  <oryx-cart-quantity-input
                    ref="numberOfPickedInput"
                    min="0"
                    .max="${this.productItem?.quantity}"
                    .value="${this.productItem?.numberOfPicked}"
                    submitOnChange
                    @submit=${this.onChangeQuantity}
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
              () => this.renderEditStatus()
            )}
          </oryx-card>
        `
      )}
    `;
  }

  protected renderEditStatus(): TemplateResult {
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
            >${this.productItem?.numberOfPicked} out of
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
