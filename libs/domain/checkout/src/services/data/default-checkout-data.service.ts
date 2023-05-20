import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { catchError, map, Observable, of, shareReplay, switchMap } from 'rxjs';
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

  protected load$ = this.cartId.pipe(
    switchMap((cartId) => (cartId ? this.adapter.get({ cartId }) : of(null))),
    // in some cases, when cart is not yet created, we get 422 error from the backend
    catchError(() => of({} as CheckoutData)),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  get<K extends keyof CheckoutData>(
    key: K
  ): Observable<CheckoutData[K] | undefined> {
    return this.load$.pipe(
      map((data) => data?.[key] as CheckoutData[K] | undefined)
    );
  }
}
