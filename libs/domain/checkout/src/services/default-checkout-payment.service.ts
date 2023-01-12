import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/di';
import { map, Observable, of, switchMap, take, tap } from 'rxjs';
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

  setPaymentMethod(id: string): Observable<void> {
    this.getMethods()
      .pipe(
        take(1),
        tap((methods) => {
          const payment = methods?.find((method) => method.id === id);
          if (payment) {
            this.dataService.setPayment(payment);
          }
        })
      )
      .subscribe();
    return of(undefined);
  }
}
