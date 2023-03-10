import { CartComponentMixin, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentMixin, defaultOptions } from '@spryker-oryx/experience';
import { ProductService } from '@spryker-oryx/product';
import { ModalComponent } from '@spryker-oryx/ui/modal';
import {
  asyncState,
  hydratable,
  i18n,
  valueType,
} from '@spryker-oryx/utilities';
import { html, LitElement, TemplateResult } from 'lit';
import { state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { CartEntryChangeEventDetail } from '../../entry/src';
import { CartEntriesOptions } from './entries.model';
import { cartEntriesStyles } from './entries.styles';

@defaultOptions({
  defaultExpandedOptions: true,
  silentRemove: false,
} as CartEntriesOptions)
@hydratable('window:load')
export class CartEntriesComponent extends CartComponentMixin(
  ContentMixin<CartEntriesOptions>(LitElement)
) {
  static styles = cartEntriesStyles;

  protected cartService = resolve(CartService);
  protected productService = resolve(ProductService);

  @asyncState()
  protected isEmpty = valueType(this.cartService.isEmpty());

  @asyncState()
  protected isBusy = valueType(this.cartService.isBusy());

  // TODO: implement loading state
  protected override render(): TemplateResult | void {
    if (!this.entries?.length) return this.renderEmpty();

    return html`
      <oryx-heading appearance="h4" sm-appearance="h3">
        <h1>${i18n('cart.totals.<count>-items', { count: 7 })}</h1>
      </oryx-heading>

      <section class="entries">
        ${repeat(
          this.entries,
          (entry) => entry.groupKey,
          (entry) =>
            html`
              <cart-entry
                .key=${entry.groupKey}
                @entry.submit=${() => console.log('on submit...')}
                ?readonly=${this.componentOptions.readonly}
              ></cart-entry>
            `
        )}
      </section>
      ${this.renderConfirmation()}
    `;
  }

  constructor() {
    super();

    this.addEventListener('submit', this.onUpdate as EventListener);
  }

  protected _request?: string;
  @state()
  protected set requestRemoval(value: string | undefined) {
    this._request = value;
    const modal = this.shadowRoot?.querySelector<ModalComponent>('oryx-modal');
    if (modal) modal.open();
  }

  protected get requestRemoval(): string | undefined {
    return this._request;
  }

  /**
   * Handles updates on the entry. When the quantity is 0, the entry is going
   * to be removed unless the component options require to seek for confirmation first.
   */
  protected onUpdate(ev: CustomEvent<CartEntryChangeEventDetail>): void {
    const { groupKey, quantity, sku } = ev.detail;
    if (ev.detail.quantity === 0) {
      if (this.componentOptions?.silentRemove) {
        this.removeEntry(ev.detail.groupKey);
      } else {
        this.requestRemoval = ev.detail.groupKey;
      }
    } else {
      // if (ev.detail.quantity === 0) {
      //   if (this.componentOptions?.silentRemove) {
      //     this.onRemove(ev.detail.groupKey);
      //   } else {
      //     this.requestRemoval = ev.detail.groupKey;
      //   }
      // } else {
      this.cartService.updateEntry({
        groupKey,
        quantity,
        sku,
      });
    }
  }

  protected removeEntry(groupKey?: string): void {
    if (groupKey) {
      this.cartService.deleteEntry({ groupKey });
    }
    // }
  }

  protected renderConfirmation(): TemplateResult {
    return html`<oryx-modal
      enableFooter
      enableCloseButtonInHeader
      heading=${i18n('cart.entry.confirmation.heading')}
    >
      ${i18n(`cart.entry.confirm-remove-<item>`, { item: '"entry name"' })}
      <oryx-button
        slot="footer-more"
        type="primary"
        size="small"
        @click=${() => this.removeEntry(this.requestRemoval)}
      >
        <button value="remove">${i18n(`cart.entry.remove`)}</button>
      </oryx-button>
    </oryx-modal>`;
  }

  // TODO: we like to remove this, since this should be content managed
  protected renderEmpty(): TemplateResult {
    return html`
      <section class="empty">
        <oryx-icon type="cart"></oryx-icon>
        <p>Your shopping cart is empty</p>
        <oryx-button size="large">
          <button>Shop now</button>
        </oryx-button>
      </section>
    `;
  }

  // protected entries$ = this.options$.pipe(
  //   switchMap(({ cartId }) =>
  //     this.cartService.getEntries({ cartId }).pipe(
  //       switchMap(
  //         (entries) =>
  //           entries?.reduce(
  //             (acc$, entry) =>
  //               acc$.pipe(
  //                 switchMap((acc) =>
  //                   this.productService
  //                     .get({ sku: entry.sku })
  //                     .pipe(
  //                       map((product) => [
  //                         ...acc,
  //                         { ...entry, availability: product?.availability },
  //                       ])
  //                     )
  //                 )
  //               ),
  //             of([] as CartEntry[])
  //           ) ?? of([])
  //       ),
  //       tap(() => {
  //         this.currentlyUpdated$.next(null);
  //       })
  //     )
  //   )
  // );

  // protected entriesData$ = combineLatest([
  //   this.entries$,
  //   this.loading$,
  //   this.currentlyUpdated$,
  //   this.options$,
  // ]).pipe(
  //   map(([entries, loading, currentlyUpdated, options]) => ({
  //     entries,
  //     loading,
  //     currentlyUpdated,
  //     options,
  //   }))
  // );
  // protected renderItemsCount(entriesData: EntriesData): TemplateResult {
  //   const { options, entries } = entriesData;

  //   if (options.hideItemsCount) {
  //     return html``;
  //   }

  //   const count = entries.reduce((acc, { quantity }) => quantity + acc, 0);

  //   return html`
  //     <oryx-chip>${count} ${count === 1 ? 'item' : 'items'}</oryx-chip>
  //   `;
  // }
}
