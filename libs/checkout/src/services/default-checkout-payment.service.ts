import { CartService } from '@spryker-oryx/cart';
import { inject } from '@spryker-oryx/injector';
import { map, Observable, of, switchMap, take } from 'rxjs';
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

  setPaymentMethod(name: string): Observable<void> {
    return this.getMethods().pipe(
      map((methods) => {
        const payment = methods?.find((method) => method.name === name);
        if (payment) {
          this.dataService.setPaymentDetails(payment);
        }
        return undefined;
      })
    );
  }
}
