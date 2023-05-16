import { CheckoutResponse, CheckoutState } from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';

export class MockCheckoutService {
  getProcessState(): Observable<CheckoutState> {
    return of(CheckoutState.Ready);
  }

  placeOrder(): Observable<CheckoutResponse> {
    return of({ orderReference: 'test' });
  }
}
