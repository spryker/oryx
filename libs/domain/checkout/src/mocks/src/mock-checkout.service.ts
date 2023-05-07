import {
  Checkout,
  CheckoutProcessState,
  CheckoutResponse,
  CheckoutService,
} from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';

export class MockCheckoutService<T extends Checkout>
  implements CheckoutService<T>
{
  getProcessState(): Observable<CheckoutProcessState> {
    return of(CheckoutProcessState.Ready);
  }

  placeOrder(): Observable<CheckoutResponse> {
    return of({ orderReference: 'test' });
  }
}
