import { CartEntry, CartService } from '@spryker-oryx/cart';
import {
  QuantityEventDetail,
  QuantityInputComponent,
} from '@spryker-oryx/cart/quantity-input';
import { resolve } from '@spryker-oryx/di';
import { ContentController } from '@spryker-oryx/experience';
import {
  Product,
  ProductComponentMixin,
  ProductController,
} from '@spryker-oryx/product';
import { IconTypes } from '@spryker-oryx/themes/icons';
import { ButtonType } from '@spryker-oryx/ui/button';
import { Size } from '@spryker-oryx/ui/utilities';
import {
  asyncValue,
  hydratable,
  i18n,
  subscribe,
} from '@spryker-oryx/utilities';
import { html, TemplateResult } from 'lit';
import { createRef, ref } from 'lit/directives/ref.js';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  delay,
  map,
  of,
  shareReplay,
  Subject,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { CartAddOptions } from './add.model';
import { styles } from './add.styles';

@hydratable(['click', 'focusin'])
export class CartAddComponent extends ProductComponentMixin<CartAddOptions>() {
  static styles = styles;

  protected cartService = resolve(CartService);

  protected options$ = new ContentController(this).getOptions();
  protected product$ = new ProductController(this).getProduct();

  protected data$ = combineLatest([
    this.options$,
    this.product$,
    this.cartService.getEntries(),
  ]).pipe(shareReplay({ bufferSize: 1, refCount: true }));

  protected min$ = this.data$.pipe(
    map(([_, product, entries]) => this.calculateMin(product, entries)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected max$ = this.data$.pipe(
    map(([_, product, entries]) => this.calculateMax(product, entries)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  protected isBusy$ = new BehaviorSubject(false);
  protected isQuantityInvalid$ = new BehaviorSubject(false);
  protected isConfirmed$ = new BehaviorSubject(false);
  protected isDisabled$ = combineLatest([
    this.min$.pipe(map((m) => m === 0)),
    this.isBusy$,
    this.isConfirmed$,
    this.isQuantityInvalid$,
  ]).pipe(map((a) => !!a.find((a) => !!a)));

  protected triggerEntry$ = new Subject<number>();
  protected quantityInputRef = createRef<QuantityInputComponent>();

  @subscribe()
  protected add$ = this.triggerEntry$.pipe(
    tap(() => this.isBusy$.next(true)),
    withLatestFrom(this.product$),
    switchMap(([quantity, product]) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.cartService.addEntry({ sku: product!.sku!, quantity })
    ),
    tap(() => {
      this.isBusy$.next(false);
      this.isConfirmed$.next(true);
    }),
    delay(800),
    tap(() => this.isConfirmed$.next(false)),
    catchError(() => {
      this.isBusy$.next(false);
      return of(null);
    })
  );

  protected override render(): TemplateResult {
    return html` ${asyncValue(this.data$, ([options, product]) =>
      product?.sku
        ? html`${this.renderQuantity(options)} ${this.renderButton(options)}`
        : html``
    )}`;
  }

  protected renderQuantity(options: Partial<CartAddOptions>): TemplateResult {
    if (options.hideQuantityInput) {
      return html``;
    }

    return html`<oryx-cart-quantity-input
      ${ref(this.quantityInputRef)}
      .min=${asyncValue(this.min$)}
      .value=${asyncValue(this.min$)}
      .max=${asyncValue(this.max$)}
      @update=${this.onUpdate}
      @submit=${this.onSubmit}
    ></oryx-cart-quantity-input>`;
  }

  protected renderButton(options: Partial<CartAddOptions>): TemplateResult {
    return html` <oryx-button
      size=${Size.small}
      ?loading=${asyncValue(this.isBusy$)}
      ?confirmed=${asyncValue(this.isConfirmed$)}
      type=${ButtonType.Primary}
      ?outline=${options.outlined}
    >
      <button
        ?disabled=${asyncValue(this.isDisabled$)}
        ?inert=${asyncValue(this.isBusy$)}
        @click=${this.onSubmit}
      >
        <oryx-icon .type=${IconTypes.CartAdd} size=${Size.large}></oryx-icon>
        ${i18n('cart.add-to-cart')}
      </button>
    </oryx-button>`;
  }

  /**
   * Returns 0 when the max available quantity is smaller than the min order quantity.
   */
  protected calculateMin(
    product: Product | null,
    entries: CartEntry[]
  ): number {
    const maxAvailable = this.calculateMax(product, entries);
    const minOrderQuantity = 1;
    return maxAvailable !== undefined && maxAvailable < minOrderQuantity
      ? 0
      : minOrderQuantity;
  }

  /**
   * When the product has a maximum quantity defined, we take the cumulated quantity from
   * the active cart, and subtract this number from the available quantity.
   */
  protected calculateMax(
    product: Product | null,
    entries: CartEntry[]
  ): number | undefined {
    const cumulatedEntryCount = entries
      .filter((entry) => entry.sku === product?.sku)
      .map((entry) => entry.quantity)
      .reduce((a: number, b) => a + b, 0);
    return product?.availability?.quantity
      ? product?.availability?.quantity - cumulatedEntryCount
      : undefined;
  }

  protected onUpdate(e: CustomEvent<QuantityEventDetail>): void {
    this.isQuantityInvalid$.next(!!e.detail.isInvalid);
  }

  protected onSubmit(e: Event | CustomEvent<QuantityEventDetail>): void {
    this.triggerEntry$.next(
      (e as CustomEvent).detail?.quantity ??
        this.quantityInputRef.value?.value ??
        1
    );
  }
}
