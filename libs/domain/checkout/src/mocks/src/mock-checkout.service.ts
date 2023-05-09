import {
  Checkout,
  CheckoutResponse,
  CheckoutService,
  CheckoutState,
} from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';

export class MockCheckoutService<T extends Checkout>
  implements CheckoutService<T>
{
  getProcessState(): Observable<CheckoutState> {
    return of(CheckoutState.Ready);
  }

  placeOrder(): Observable<CheckoutResponse> {
    return of({ orderReference: 'test' });
  }
}
