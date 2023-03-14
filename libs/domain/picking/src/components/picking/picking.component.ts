import { resolve } from '@spryker-oryx/di';
import { asyncState, i18n, observe, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BehaviorSubject, distinctUntilChanged, map, switchMap } from 'rxjs';
import { ItemFilters, PickingListStatus } from '../../models';
import { PickingListService } from '../../services';

export class PickingComponent extends LitElement {
  @property({ attribute: 'picking-id' })
  pickingId?: string;

  @observe()
  protected pickingId$ = new BehaviorSubject(this.pickingId);

  protected pickingListService = resolve(PickingListService);

  protected pickingList$ = this.pickingId$.pipe(
    distinctUntilChanged(),
    switchMap((id) => this.pickingListService.getById(id ?? ''))
  );

  //TODO - filter by item.status when it's there again
  @asyncState()
  protected notPickedItems = valueType(
    this.pickingList$.pipe(
      map((list) =>
        list?.items.filter(
          (item) => list.status === PickingListStatus.ReadyForPicking
        )
      )
    )
  );

  @asyncState()
  protected pickedItems = valueType(
    this.pickingList$.pipe(
      map((list) =>
        list?.items.filter(
          (item) =>
            item.numberOfPicked &&
            list.status === PickingListStatus.PickingFinished
        )
      )
    )
  );

  @asyncState()
  protected notFoundItems = valueType(
    this.pickingList$.pipe(
      map((list) =>
        list?.items.filter(
          (item) =>
            item.numberOfNotPicked ||
            (item.numberOfPicked < item.quantity &&
              list.status === PickingListStatus.PickingFinished)
        )
      )
    )
  );

  protected tabs = [
    {
      id: ItemFilters.NotPicked,
      title: 'not-picked',
      items: this.notPickedItems,
    },
    { id: ItemFilters.Picked, title: 'picked', items: this.pickedItems },
    { id: ItemFilters.NotFound, title: 'not-found', items: this.notFoundItems },
  ];

  protected override render(): TemplateResult {
    this.tabs[0].items = this.notPickedItems;
    this.tabs[1].items = this.pickedItems;
    this.tabs[2].items = this.notFoundItems;
    return html`<oryx-tabs appearance="secondary">
      ${this.renderTabs()} ${this.renderTabContents()}
    </oryx-tabs>`;
  }

  protected renderTabs(): TemplateResult {
    return html`${repeat(
      this.tabs,
      (tab) => html`<oryx-tab for="tab-${tab.id}">
        ${i18n(`picking.${tab.title}`)}
        <oryx-chip dense>${tab.items?.length ?? '0'}</oryx-chip>
      </oryx-tab>`
    )}`;
  }

  protected renderTabContents(): TemplateResult {
    return html`${repeat(
      this.tabs,
      (tab) => html`<div slot="panels" id="tab-${tab.id}">
        ${tab.items && tab.items?.length > 0
          ? repeat(
              tab.items,
              (item) =>
                html`<oryx-picking-product-card .productItem=${item.product}>
                  ${item.product.sku} ${item.product.productName}
                </oryx-picking-product-card>`
            )
          : this.renderFallback()}
      </div>`
    )}`;
  }

  protected renderFallback(): TemplateResult {
    return html`<p>${i18n('picking.no-picking-items-found')}</p>`;
  }
}

export default PickingComponent;
