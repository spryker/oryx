import {
  CheckoutResponse,
  CheckoutService,
  CheckoutStatus,
} from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';

export class MockCheckoutService implements Partial<CheckoutService> {
  getStatus(): Observable<CheckoutStatus> {
    return of(CheckoutStatus.Ready);
  }

  placeOrder(): Observable<CheckoutResponse> {
    return of({ orderReference: 'test' });
  }
}
