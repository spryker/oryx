import { resolve } from '@spryker-oryx/di';
import { asyncState, i18n, observe, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import {
  BehaviorSubject,
  combineLatest,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import { ItemsFilters, ProductItemPickedEvent } from '../../models';
import { PickingListService } from '../../services';
import { styles } from './picking.styles';

export class PickingComponent extends LitElement {
  static styles = styles;

  @property({ attribute: 'picking-id' }) pickingId?: string;

  @observe('pickingId')
  protected pickingId$ = new BehaviorSubject(this.pickingId);

  protected pickingListService = resolve(PickingListService);
  protected pickingList$ = this.pickingId$.pipe(
    distinctUntilChanged(),
    switchMap((id) => this.pickingListService.getById(id ?? ''))
  );

  @asyncState()
  protected pickingList = valueType(this.pickingList$);

  protected pickingUpdate$ = new BehaviorSubject<string | null>(null);

  protected tabs$ = combineLatest([
    this.pickingList$,
    this.pickingUpdate$,
  ]).pipe(
    map(([list]) => [
      {
        id: ItemsFilters.NotPicked,
        title: 'not-picked',
        items: list?.items.filter(
          (item) => item.status === ItemsFilters.NotPicked
        ),
      },
      {
        id: ItemsFilters.Picked,
        title: 'picked',
        items: list?.items.filter(
          (item) => item.numberOfPicked && item.status === ItemsFilters.Picked
        ),
      },
      {
        id: ItemsFilters.NotFound,
        title: 'not-found',
        items: list?.items.filter(
          (item) =>
            item.numberOfNotPicked ||
            (item.numberOfPicked < item.quantity &&
              item.status === ItemsFilters.NotFound)
        ),
      },
    ])
  );

  @asyncState()
  protected tabs = valueType(this.tabs$);

  protected changeNumberOfPicked(event: Event): void {
    const detail = (event as CustomEvent<ProductItemPickedEvent>).detail;

    this.pickingList?.items.map((item) => {
      if (
        item.product.id === detail.productId &&
        detail.numberOfPicked &&
        detail.numberOfPicked <= item.quantity &&
        detail.numberOfPicked >= 0
      ) {
        item.numberOfPicked = detail.numberOfPicked;
        item.numberOfNotPicked = item.quantity - item.numberOfPicked;
      }
    });
  }

  protected savePickingItem(event: Event): void {
    const detail = (event as CustomEvent<ProductItemPickedEvent>).detail;

    this.pickingList?.items.map((item) => {
      if (item.product.id === detail.productId) {
        item.status = ItemsFilters.Picked;
      }
    });

    this.pickingUpdate$.next(detail.productId);
  }

  protected editPickingItem(event: Event): void {
    const detail = (event as CustomEvent<ProductItemPickedEvent>).detail;

    this.pickingList?.items.forEach((item) => {
      if (item.product.id === detail.productId) {
        item.status = ItemsFilters.NotPicked;
      }
    });

    this.pickingUpdate$.next(detail.productId);
  }

  protected override render(): TemplateResult {
    return html`<oryx-tabs appearance="secondary">
      ${this.renderTabs()} ${this.renderTabContents()}
    </oryx-tabs>`;
  }

  protected renderTabs(): TemplateResult {
    return this.tabs
      ? html`${repeat(
          this.tabs,
          (tab) => html`<oryx-tab for="tab-${tab.id}">
            ${i18n(`picking.${tab.title}`)}
            <oryx-chip dense>${tab.items?.length ?? '0'}</oryx-chip>
          </oryx-tab>`
        )}`
      : html``;
  }

  protected renderTabContents(): TemplateResult {
    return this.tabs
      ? html`${repeat(
          this.tabs,
          (tab) => html`<div
            slot="panels"
            id="tab-${tab.id}"
            class="tab-panels"
          >
            ${tab.items?.length
              ? repeat(
                  tab.items,
                  (item) =>
                    html`
                      <oryx-picking-product-card
                        .productItem=${item}
                        .status=${tab.id}
                        @oryx.change-number-of-picked=${this
                          .changeNumberOfPicked}
                        @oryx.submit=${this.savePickingItem}
                        @oryx.edit=${this.editPickingItem}
                      ></oryx-picking-product-card>
                    `
                )
              : this.renderFallback()}
          </div>`
        )}`
      : html``;
  }

  protected renderFallback(): TemplateResult {
    return html`<p>${i18n('picking.no-picking-items-found')}</p>`;
  }
}

export default PickingComponent;
