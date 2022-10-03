import { CartQualifier, CartService } from '@spryker-oryx/cart';
import { resolve } from '@spryker-oryx/injector';
import { PricingService } from '@spryker-oryx/site';
import { combineLatest, filter, map, Observable, of, switchMap } from 'rxjs';
import { Cart, CartDiscount, CartTotals, PriceMode } from '../models';
export interface FormattedDiscount extends Omit<CartDiscount, 'amount'> {
  amount: string;
}

export interface FormattedCartTotals {
  calculations: {
    [key in keyof CartTotals]: string;
  };
  priceMode: PriceMode;
  itemsQuantity: number | null;
  discounts?: FormattedDiscount[];
}

export class CartController {
  protected cartService = resolve(CartService);
  protected pricingService = resolve(PricingService);

  /**
   * Returns the cumulated quantities of all cart entries.
   */
  getTotalQuantity(data?: CartQualifier): Observable<number | null> {
    return this.cartService
      .getCart(data)
      .pipe(map((cart) => this.cumulateQuantity(cart)));
  }

  getTotals(data?: CartQualifier): Observable<FormattedCartTotals | null> {
    return this.cartService.getCart(data).pipe(
      filter(<T extends Cart>(cart: T | null): cart is T => cart !== null),
      switchMap((cart) => {
        const itemsQuantity = this.cumulateQuantity(cart);
        return itemsQuantity
          ? combineLatest([
              this.formatTotals(cart),
              this.formatDiscounts(cart),
              of({
                itemsQuantity,
                priceMode: cart.priceMode,
              }),
            ])
          : of([]);
      }),
      map(([calculations, discounts, details]) => {
        return !calculations
          ? null
          : {
              calculations,
              ...(discounts && { discounts }),
              ...details,
            };
      })
    );
  }

  /**
   * Cumulates the quantities for all the cart entries.
   */
  protected cumulateQuantity(cart: Cart | null): number | null {
    return (
      cart?.products?.reduce((acc, { quantity }) => acc + quantity, 0) ?? null
    );
  }

  protected formatDiscounts(cart: Cart): Observable<FormattedDiscount[]> {
    return of(cart).pipe(
      switchMap((cart) =>
        (cart.discounts ?? []).reduce(
          (acc$, discount) =>
            acc$.pipe(
              switchMap((acc) =>
                this.pricingService.format(-discount.amount).pipe(
                  filter(<T>(amount: T | null): amount is T => amount !== null),
                  map((amount) => [...acc, { ...discount, amount }])
                )
              )
            ),
          of([] as FormattedDiscount[])
        )
      )
    );
  }

  /**
   * Formats the cart totals by using the `PricingService.format()` method. The price
   * formatting requires a lookup on the locale and currency, which is why this API is
   * observable based.
   */
  protected formatTotals(
    cart: Cart
  ): Observable<FormattedCartTotals['calculations']> {
    return of(cart).pipe(
      switchMap((cart) =>
        Object.entries(cart.totals ?? {}).reduce(
          (acc$, [priceType, price = 0]) => {
            if (priceType === 'discountTotal') {
              price = -price;
            }
            return acc$.pipe(
              switchMap((acc) =>
                this.pricingService.format(price).pipe(
                  map((formattedPrice) => ({
                    ...acc,
                    [priceType]: formattedPrice as string,
                  }))
                )
              )
            );
          },
          of({} as FormattedCartTotals['calculations'])
        )
      )
    );
  }
}
