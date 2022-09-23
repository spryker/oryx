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

  getTotalItemsQuantity(data?: CartQualifier): Observable<number | null> {
    return this.cartService
      .getCart(data)
      .pipe(map((cart) => this.calculateQuantity(cart)));
  }

  getTotals(data?: CartQualifier): Observable<FormattedCartTotals | null> {
    return this.cartService.getCart(data).pipe(
      filter(<T extends Cart>(cart: T | null): cart is T => cart !== null),
      switchMap((cart) =>
        combineLatest([
          this.formatTotals(cart),
          this.formatDiscounts(cart),
          of({
            itemsQuantity: this.calculateQuantity(cart),
            priceMode: cart.priceMode,
          }),
        ])
      ),
      map(([totals, discounts, details]) => {
        return {
          calculations: totals,
          ...(discounts && { discounts }),
          ...details,
        };
      })
    );
  }

  protected calculateQuantity(cart: Cart | null): number | null {
    return cart !== null
      ? cart?.products?.reduce((acc, { quantity }) => acc + quantity, 0) ?? null
      : null;
  }

  protected formatDiscounts(
    cart: Cart
  ): Observable<FormattedDiscount[] | null> {
    return of(cart).pipe(
      filter(
        <T extends Cart>(cart: T | null): cart is T =>
          cart !== null && Array.isArray(cart.discounts)
      ),
      switchMap((cart) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        cart.discounts!.reduce(
          (acc$, discount) =>
            acc$.pipe(
              switchMap((acc) =>
                this.pricingService.format(discount.amount).pipe(
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

  protected formatTotals(
    cart: Cart
  ): Observable<FormattedCartTotals['calculations']> {
    return of(cart).pipe(
      switchMap((cart) =>
        Object.entries(cart.totals ?? {}).reduce((acc$, [priceType, price]) => {
          if (!price) {
            return acc$;
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
        }, of({} as FormattedCartTotals['calculations']))
      )
    );
  }
}
