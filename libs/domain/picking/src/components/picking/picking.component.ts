import { resolve } from '@spryker-oryx/di';
import { RouterService } from '@spryker-oryx/router';
import {
  asyncState,
  i18n,
  subscribe,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BehaviorSubject, take, tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import {
  ItemsFilters,
  PartialPicking,
  PickingListItem,
  PickingListStatus,
  PickingTab,
  ProductItemPickedEvent,
} from '../../models';
import { styles } from './picking.styles';
export class PickingComponent extends PickingListMixin(LitElement) {
  static styles = styles;

  protected routerService = resolve(RouterService);

  protected isConfirmPickingDialogOpen$ = new BehaviorSubject(false);
  @asyncState()
  protected isConfirmPickingDialogOpen = valueType(
    this.isConfirmPickingDialogOpen$
  );

  @state()
  protected partialPicking: PartialPicking | undefined;

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

  protected savePickingItem(event: Event): void {
    const detail = (event as CustomEvent<ProductItemPickedEvent>).detail;

    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === detail.productId
    );

    if (
      !(
        detail.numberOfPicked &&
        detail.numberOfPicked === this.items[productIndex].quantity
      )
    ) {
      this.partialPicking = {
        productId: detail.productId,
        currentNumberOfPicked: detail.numberOfPicked,
        quantity: this.items[productIndex].quantity,
      };

      this.isConfirmPickingDialogOpen$.next(true);
      return;
    }

    this.updatePickingItem(productIndex, detail.numberOfPicked);
  }

  protected editPickingItem(event: Event): void {
    const detail = (event as CustomEvent<ProductItemPickedEvent>).detail;

    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === detail.productId
    );
    this.items[productIndex].status = ItemsFilters.NotPicked;

    this.items = [...this.items];
  }

  protected onModalClose(): void {
    this.isConfirmPickingDialogOpen$.next(false);
  }

  protected confirmPartialPicking(): void {
    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === this.partialPicking?.productId
    );

    this.updatePickingItem(
      productIndex,
      this.partialPicking?.currentNumberOfPicked
    );

    this.partialPicking = undefined;
    this.isConfirmPickingDialogOpen$.next(false);
  }

  protected finishPicking(): void {
    this.pickingList.status = PickingListStatus.PickingFinished;

    this.pickingListService.finishPicking(this.pickingList);
    this.routerService.navigate(`/`);
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
      ${when(
        tabs.length,
        () =>
          html`${repeat(
            tabs,
            (tab) => html`<div
              slot="panels"
              id="tab-${tab.id}"
              class="tab-panels"
            >
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
          )}`
      )}
    `;
  }

  protected renderFallback(): TemplateResult {
    const pickedItems = this.pickingList?.items.filter(
      (item) => item.status === ItemsFilters.Picked
    );

    const isPickingComplete =
      pickedItems?.length === this.pickingList?.items.length;

    return html`
      ${when(
        isPickingComplete,
        () =>
          html`
            <div class="picking-complete">
              <div class="img-wrap">
                <oryx-image resource="picking-items-processed"></oryx-image>
              </div>
              <h3 class="title-empty">${i18n(`picking.great-job`)}!</h3>
              <p>${i18n(`picking.all-items-are-processed`)}!</p>
            </div>
            <div class="submit-wrapper scroll-shadow">
              <oryx-button type="primary" outline="true">
                <button @click=${this.finishPicking}>
                  ${i18n('picking.finish-picking')}
                </button>
              </oryx-button>
            </div>
          `
      )}
    `;
  }

  protected renderConfirmationModal(): TemplateResult {
    return html`
      <oryx-modal
        ?open=${this.isConfirmPickingDialogOpen}
        enableFooter
        preventclosebybackdrop
      >
        <div slot="heading">
          ${i18n('picking.product-card.confirm-picking')}
        </div>

        <span>
          You only picked
          <span class="bold-text">
            ${this.partialPicking?.currentNumberOfPicked} out of
            ${this.partialPicking?.quantity}
          </span>
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
