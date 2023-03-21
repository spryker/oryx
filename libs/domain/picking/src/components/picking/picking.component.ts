import { resolve } from '@spryker-oryx/di';
import { asyncState, i18n, observe, valueType } from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BehaviorSubject, distinctUntilChanged, map, switchMap } from 'rxjs';
import { ItemsFilters } from '../../models';
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

  protected tabs$ = this.pickingList$.pipe(
    map((list) => [
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
          (tab) => html`<div slot="panels" id="tab-${tab.id}">
            ${tab.items?.length
              ? repeat(
                  tab.items,
                  (item) =>
                    html`<oryx-picking-product-card
                      .productItem=${item.product}
                    >
                      ${item.product.sku} ${item.product.productName}
                    </oryx-picking-product-card>`
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
