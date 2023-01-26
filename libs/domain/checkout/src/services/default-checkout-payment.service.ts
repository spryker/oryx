import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { subscribeReplay } from '@spryker-oryx/utilities';
import {
  catchError,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { ApiCheckoutModel, PaymentMethod } from '../models';
import { CheckoutAdapter } from './adapter';
import { CheckoutDataService } from './checkout-data.service';
import { CheckoutPaymentService } from './checkout-payment.service';

export class DefaultCheckoutPaymentService implements CheckoutPaymentService {
  constructor(
    protected cartService = inject(CartService),
    protected adapter = inject(CheckoutAdapter),
    protected dataService = inject(CheckoutDataService)
  ) {}

  protected methods$ = this.cartService.getCart().pipe(
    switchMap((cart) =>
      !cart
        ? of(null)
        : this.adapter.get({
            cartId: cart.id,
            include: [ApiCheckoutModel.Includes.PaymentMethods],
          })
    ),
    // in some cases, (when cart is not yet created or thresholds are not met), we get 422 error from the backend
    catchError(() => of(null)),
    map((data) => data?.paymentMethods ?? null),
    shareReplay({ bufferSize: 1, refCount: true })
  );

  getMethods(): Observable<PaymentMethod[] | null> {
    return this.methods$;
  }

  setPaymentMethod(id: string): Observable<unknown> {
    return subscribeReplay(
      this.getMethods().pipe(
        take(1),
        map((methods) => methods?.find((method) => method.id === id)),
        switchMap((method) =>
          method
            ? this.dataService.setPayment(method)
            : throwError(() => new Error('Payment method not found'))
        )
      )
    );
  }
}
