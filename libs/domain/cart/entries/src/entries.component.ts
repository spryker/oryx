import { CartComponentMixin, CartEntry, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import { ProductService } from '@spryker-oryx/product';
import { asyncValue, hydratable } from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { BehaviorSubject, combineLatest, map, of, switchMap, tap } from 'rxjs';
import { CartEntriesOptions } from './entries.model';
import { styles } from './entries.styles';

interface EntriesData {
  entries: CartEntry[];
  loading: boolean;
  currentlyUpdated: string | null;
  options: Partial<CartEntriesOptions>;
}

@hydratable('window:load')
export class CartEntriesComponent extends CartComponentMixin<CartEntriesOptions>() {
  static styles = styles;

  protected cartService = resolve(CartService);
  protected productService = resolve(ProductService);
  protected contentController = new ContentController(this);

  protected options$ = this.contentController.getOptions();

  protected currentlyUpdated$ = new BehaviorSubject<string | null>(null);

  protected loading$ = this.cartService.getLoadingState();

  protected entries$ = this.options$.pipe(
    switchMap(({ cartId }) =>
      this.cartService.getEntries({ cartId }).pipe(
        switchMap(
          (entries) =>
            entries?.reduce(
              (acc$, entry) =>
                acc$.pipe(
                  switchMap((acc) =>
                    this.productService
                      .get({ sku: entry.sku })
                      .pipe(
                        map((product) => [
                          ...acc,
                          { ...entry, availability: product?.availability },
                        ])
                      )
                  )
                ),
              of([] as CartEntry[])
            ) ?? of([])
        ),
        tap(() => {
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

  protected onUpdate(e: CustomEvent, { groupKey, sku }: CartEntry): void {
    this.currentlyUpdated$.next(groupKey);
    this.cartService.updateEntry({
      groupKey,
      sku,
      quantity: e.detail.quantity,
    });
  }

  protected onRemove({ groupKey }: CartEntry): void {
    this.cartService.deleteEntry({ groupKey });
  }

  protected renderEmpty(): TemplateResult {
    return html`
      <section>
        <oryx-icon type="cart"></oryx-icon>
        <p>Your shopping cart is empty</p>
        <oryx-button>
          <button>Shop now</button>
        </oryx-button>
      </section>
    `;
  }

  protected renderEntries(entriesData: EntriesData): TemplateResult {
    const { entries, loading, currentlyUpdated, options } = entriesData;

    return html` ${repeat(
      entries,
      (entry) => entry.groupKey,
      (entry) => html`
        <cart-entry
          ?inert=${loading}
          .options=${{
            ...options,
            ...entry,
            disabled: loading,
            updating: entry.groupKey === currentlyUpdated,
          }}
          @submit=${(e: CustomEvent): void => this.onUpdate(e, entry)}
          @oryx.remove=${(): void => this.onRemove(entry)}
        ></cart-entry>
      `
    )}`;
  }

  protected renderItemsCount(entriesData: EntriesData): TemplateResult {
    const { options, entries } = entriesData;

    if (options.hideItemsCount) {
      return html``;
    }

    const count = entries.reduce((acc, { quantity }) => quantity + acc, 0);

    return html`
      <oryx-chip>${count} ${count === 1 ? 'item' : 'items'}</oryx-chip>
    `;
  }

  protected renderCollapsibleContainer(
    entriesData: EntriesData
  ): TemplateResult {
    const { options } = entriesData;

    return html`
      <oryx-collapsible ?open=${options.expanded}>
        <span slot="header">
          Products in the order ${this.renderItemsCount(entriesData)}
        </span>

        ${this.renderEntries(entriesData)}
      </oryx-collapsible>
    `;
  }

  protected override render(): TemplateResult {
    return html`
      ${asyncValue(this.entriesData$, (entriesData) => {
        const { entries, options } = entriesData;

        if (!entries.length) {
          return this.renderEmpty();
        }

        if (options?.collapsible) {
          return this.renderCollapsibleContainer(entriesData);
        }

        return this.renderEntries(entriesData);
      })}
    `;
  }
}
