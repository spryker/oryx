import { CartService } from '@spryker-oryx/cart';
import { StorageService, StorageType } from '@spryker-oryx/core';
import { inject } from '@spryker-oryx/di';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  BehaviorSubject,
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import {
  ApiCheckoutModel,
  paymentCheckoutStorageKey,
  PaymentMethod,
} from '../../models';
import { CheckoutAdapter } from '../adapter';
import { CheckoutPaymentService } from './checkout-payment.service';

export class DefaultCheckoutPaymentService implements CheckoutPaymentService {
  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected storage = inject(StorageService)
  ) {}

  // TODO: make this obsolete when we move to a reactive storage
  // (using event listener on client/local storage)
  protected subject = new BehaviorSubject<string | null>(null);

  protected methods$ = this.cartService.getCart().pipe(
    switchMap((cart) => {
      return !cart?.products?.length
        ? of(null)
        : this.adapter.get({
            cartId: cart.id,
            include: [ApiCheckoutModel.Includes.PaymentMethods],
          });
    }),
    // in some cases, (when cart is not yet created or thresholds are not met), we get 422 error from the backend
    catchError(() => of(null)),
    map((data) => data?.paymentMethods ?? null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getMethods(): Observable<PaymentMethod[] | null> {
    return this.methods$;
  }

  select(key: string): Observable<unknown> {
    // this.subject.next(key);
    return subscribeReplay(this.store(key));
  }

  selected(): Observable<PaymentMethod | null> {
    return this.storage
      .get<string>(paymentCheckoutStorageKey, StorageType.SESSION)
      .pipe(
        tap((key) => {
          if (key) this.subject.next(key);
        }),
        switchMap(() => this.subject),
        switchMap((key) => {
          return this.getMethods().pipe(
            map(
              (methods) => methods?.find((method) => method.id === key) ?? null
            )
          );
        })
      );
  }

  protected store(key: string): Observable<void> {
    this.subject.next(key);
    return this.storage.set(
      paymentCheckoutStorageKey,
      key,
      StorageType.SESSION
    );
  }
}
