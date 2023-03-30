import { i18n, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { when } from 'lit/directives/when.js';
import { take, tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import {
  ItemsFilters,
  PartialPicking,
  PickingListItem,
  PickingTab,
  ProductItemPickedEvent,
} from '../../models';
import { styles } from './picking.styles';
export class PickingComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  @state()
  protected partialPicking: PartialPicking | null = null;

  @state()
  protected items: PickingListItem[] = [];

  @subscribe()
  protected itemsSubscription$ = this.pickingList$.pipe(
    take(1),
    tap((list) => {
      this.items = list?.items;
    })
  );

  protected buildTabs(): PickingTab[] {
    return [
      {
        id: ItemsFilters.NotPicked,
        title: 'not-picked',
        items: this.items?.filter(
          (item) => item.status === ItemsFilters.NotPicked
        ),
      },
      {
        id: ItemsFilters.Picked,
        title: 'picked',
        items: this.items?.filter(
          (item) => item.numberOfPicked && item.status === ItemsFilters.Picked
        ),
      },
      {
        id: ItemsFilters.NotFound,
        title: 'not-found',
        items: this.items?.filter(
          (item) =>
            item.status === ItemsFilters.Picked &&
            (item.numberOfNotPicked || item.numberOfPicked < item.quantity)
        ),
      },
    ];
  }

  protected savePickingItem(event: CustomEvent<ProductItemPickedEvent>): void {
    const { productId, numberOfPicked } = event.detail;

    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === productId
    );

    if (
      !(numberOfPicked && numberOfPicked === this.items[productIndex].quantity)
    ) {
      this.partialPicking = {
        productId: productId,
        currentNumberOfPicked: numberOfPicked,
        quantity: this.items[productIndex].quantity,
      };

      return;
    }

    this.updatePickingItem(productIndex, numberOfPicked);
  }

  protected editPickingItem(event: CustomEvent<ProductItemPickedEvent>): void {
    const { productId } = event.detail;

    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === productId
    );
    this.items[productIndex].status = ItemsFilters.NotPicked;

    this.items = [...this.items];
  }

  protected onModalClose(): void {
    this.partialPicking = null;
  }

  protected confirmPartialPicking(): void {
    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === this.partialPicking?.productId
    );

    this.updatePickingItem(
      productIndex,
      this.partialPicking?.currentNumberOfPicked
    );

    this.partialPicking = null;
  }

  protected override render(): TemplateResult {
    const tabs = this.buildTabs();

    return html`<oryx-tabs appearance="secondary">
        ${this.renderTabs(tabs)} ${this.renderTabContents(tabs)}
      </oryx-tabs>
      ${this.renderConfirmationModal()}`;
  }

  protected renderTabs(tabs: PickingTab[]): TemplateResult {
    return tabs
      ? html`${repeat(
          tabs,
          (tab) => html`<oryx-tab for="tab-${tab.id}">
            ${i18n(`picking.${tab.title}`)}
            <oryx-chip dense>${tab.items?.length ?? '0'}</oryx-chip>
          </oryx-tab>`
        )}`
      : html``;
  }

  protected renderTabContents(tabs: PickingTab[]): TemplateResult {
    return html`
      ${repeat(
        tabs,
        (tab) => html`<div slot="panels" id="tab-${tab.id}" class="tab-panels">
          ${when(
            tab.items?.length,
            () => html`
              ${repeat(
                tab.items,
                (item) => item.product.id,
                (item) =>
                  html`
                    <oryx-picking-product-card
                      .productItem=${item}
                      .status=${tab.id}
                      @oryx.submit=${this.savePickingItem}
                      @oryx.edit=${this.editPickingItem}
                    ></oryx-picking-product-card>
                  `
              )}
            `,
            () => this.renderFallback()
          )}
        </div>`
      )}
    `;
  }

  protected renderFallback(): TemplateResult {
    if (
      this.pickingList?.items.every(
        (item) => item.status === ItemsFilters.Picked
      )
    ) {
      return html`
        <div class="picking-complete">
          <div class="img-wrap">
            <oryx-image resource="picking-items-processed"></oryx-image>
          </div>
          <h3 class="title-empty">${i18n(`picking.great-job`)}!</h3>
          <p>${i18n(`picking.all-items-are-processed`)}!</p>
        </div>
      `;
    } else {
      return html``;
    }
  }

  protected renderConfirmationModal(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.partialPicking}
        enableFooter
        preventclosebybackdrop
        footerButtonFullWidth
      >
        <div slot="heading">
          ${i18n('picking.product-card.confirm-picking')}
        </div>

        <span>
          ${i18n('picking.product-card.you-only-picked')}
          <span class="picked-items-info">
            ${this.partialPicking?.currentNumberOfPicked}
            ${i18n('picking.product-card.-out-of')}
            ${this.partialPicking?.quantity}
          </span>
          ${i18n('picking.product-card.items')}.
          ${i18n(
            'picking.product-card.do-you-really-want-to-complete-the-pick?'
          )}
        </span>

        <oryx-button slot="footer" outline type="secondary">
          <button @click=${this.onModalClose}>
            ${i18n('picking.product-card.cancel')}
          </button>
        </oryx-button>

        <oryx-button slot="footer" type="primary">
          <button @click=${this.confirmPartialPicking}>
            ${i18n('picking.product-card.confirm')}
          </button>
        </oryx-button>
      </oryx-modal>
    `;
  }

  private updatePickingItem(
    productIndex: number,
    numberOfPicked?: number
  ): void {
    this.items[productIndex].numberOfPicked = numberOfPicked ?? 0;
    this.items[productIndex].numberOfNotPicked =
      this.items[productIndex].quantity -
      this.items[productIndex].numberOfPicked;

    this.items[productIndex].status = ItemsFilters.Picked;

    this.items = [...this.items];
  }
}

export default PickingComponent;
