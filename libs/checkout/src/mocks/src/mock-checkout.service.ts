import { CheckoutResponse, CheckoutService } from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';

export class MockCheckoutService implements CheckoutService {
  canCheckout(): Observable<boolean> {
    return of(true);
  }
  placeOrder(): Observable<CheckoutResponse> {
    return of({ orderReference: 'test' });
  }
}
