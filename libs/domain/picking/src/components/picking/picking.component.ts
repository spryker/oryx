import { i18n, subscribe } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { when } from 'lit-html/directives/when.js';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { take, tap } from 'rxjs';
import { PickingListMixin } from '../../mixins';
import {
  ItemsFilters,
  PickingListItem,
  PickingTab,
  ProductItemPickedEvent,
} from '../../models';
import { styles } from './picking.styles';
export class PickingComponent extends PickingListMixin(LitElement) {
  static styles = styles;

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

    this.items[productIndex].numberOfPicked = detail.numberOfPicked;
    this.items[productIndex].numberOfNotPicked =
      this.items[productIndex].quantity -
      this.items[productIndex].numberOfPicked;

    this.items[productIndex].status = ItemsFilters.Picked;

    this.items = [...this.items];
  }

  protected editPickingItem(event: Event): void {
    const detail = (event as CustomEvent<ProductItemPickedEvent>).detail;

    const productIndex = this.pickingList?.items.findIndex(
      (item) => item.product.id === detail.productId
    );
    this.items[productIndex].status = ItemsFilters.NotPicked;

    this.items = [...this.items];
  }

  protected override render(): TemplateResult {
    const tabs = this.buildTabs();

    return html`<oryx-tabs appearance="secondary">
      ${this.renderTabs(tabs)} ${this.renderTabContents(tabs)}
    </oryx-tabs>`;
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
          `
      )}
    `;
  }
}

export default PickingComponent;
