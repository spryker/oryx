import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { subscribeReplay } from '@spryker-oryx/utilities';
import { map, Observable, of, switchMap, take, throwError } from 'rxjs';
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

  getMethods(): Observable<PaymentMethod[] | null> {
    return this.cartService.getCart().pipe(
      take(1),
      switchMap((cart) =>
        !cart
          ? of(null)
          : this.adapter.get({
              cartId: cart.id,
              include: [ApiCheckoutModel.Includes.PaymentMethods],
            })
      ),
      map((data) => data?.paymentMethods ?? null)
    );
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
