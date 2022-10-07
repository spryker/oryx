import { CartComponentMixin, CartEntry, CartService } from '@spryker-oryx/cart';
import { ContentController } from '@spryker-oryx/experience';
import { resolve } from '@spryker-oryx/injector';
import { asyncValue } from '@spryker-oryx/lit-rxjs';
import { hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { BehaviorSubject, combineLatest, map, switchMap, tap } from 'rxjs';
import { CartEntriesOptions } from './entries.model';
import { styles } from './entries.styles';

@hydratable('window:load')
export class CartEntriesComponent extends CartComponentMixin<CartEntriesOptions>() {
  static styles = styles;

  protected cartService = resolve(CartService);
  protected contentController = new ContentController(this);

  protected options$ = this.contentController.getOptions();

  protected loading$ = new BehaviorSubject(true);
  protected currentlyUpdated$ = new BehaviorSubject<string | null>(null);

  protected entries$ = this.options$.pipe(
    switchMap(({ cartId }) =>
      this.cartService.getEntries({ cartId }).pipe(
        tap(() => {
          this.loading$.next(false);
          this.currentlyUpdated$.next(null);
        })
      )
    )
  );

  protected entriesData$ = combineLatest([
    this.entries$,
    this.loading$,
    this.currentlyUpdated$,
    this.options$,
  ]).pipe(
    map(([entries, loading, currentlyUpdated, options]) => ({
      entries,
      loading,
      currentlyUpdated,
      options,
    }))
  );

  protected updateQuantity(e: CustomEvent, { groupKey, sku }: CartEntry): void {
    const quantity = e.detail.quantity;

    this.loading$.next(true);
    this.currentlyUpdated$.next(groupKey);
    this.cartService.updateEntry({ groupKey, sku, quantity }).subscribe();
  }

  protected removeEntry({ groupKey }: CartEntry): void {
    this.loading$.next(true);
    this.cartService.deleteEntry({ groupKey }).subscribe();
  }

  protected renderEmpty(): TemplateResult {
    return html`
      <section>
        <oryx-icon type="cart"></oryx-icon>
        <p>Your shopping cart is empty</p>
        <oryx-button size="large">
          <button>Shop now</button>
        </oryx-button>
      </section>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(
        this.entriesData$,
        ({ entries, loading, currentlyUpdated, options }) => {
          if (!entries) {
            return html``;
          }

          if (!entries.length) {
            return this.renderEmpty();
          }

          return html`${entries.map(
            (entry) => html`
              <cart-entry
                ?inert=${loading}
                .options=${{
                  ...options,
                  ...entry,
                  disabled: loading,
                  updating: entry.groupKey === currentlyUpdated,
                }}
                @oryx.quantity=${(e: CustomEvent): void =>
                  this.updateQuantity(e, entry)}
                @oryx.remove=${(): void => this.removeEntry(entry)}
              ></cart-entry>
            `
          )}`;
        }
      )}
    `;
  }
}
