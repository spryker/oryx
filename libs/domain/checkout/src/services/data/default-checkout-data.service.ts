import { CartModificationEnd, CartService } from '@spryker-oryx/cart';
import { createQuery } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of, switchMap, take } from 'rxjs';
import { CheckoutData } from '../../models';
import { CheckoutAdapter } from '../adapter';
import { CheckoutDataService } from './checkout-data.service';

// TODO: on logout, we should clear the data (could be part of logout -> storage)
export class DefaultCheckoutDataService implements CheckoutDataService {
  constructor(
    protected adapter = inject(CheckoutAdapter),
    protected cartService = inject(CartService)
  ) {}

  protected cartId = this.cartService.getCart().pipe(map((cart) => cart?.id));

  protected query$ = createQuery({
    loader: () =>
      this.cartId.pipe(
        take(1),
        switchMap((cartId) =>
          cartId ? this.adapter.get({ cartId }) : of(null)
        )
      ),
    resetOn: [this.cartId],
    refreshOn: [CartModificationEnd],
  });

  get<K extends keyof CheckoutData>(
    key: K
  ): Observable<CheckoutData[K] | undefined> {
    return this.query$
      .get()
      .pipe(map((data) => data?.[key] as CheckoutData[K] | undefined));
  }
}
