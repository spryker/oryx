import { CheckoutResponse, CheckoutService } from '@spryker-oryx/checkout';
import { mockOrderData } from '@spryker-oryx/order/mocks';
import { Observable, of } from 'rxjs';
import { vi } from 'vitest';

export class MockCheckoutService implements CheckoutService {
  canCheckout(): Observable<boolean> {
    return of(true);
  }
  placeOrder = vi.fn().mockReturnValue(of());

  getLastOrder(): Observable<CheckoutResponse | null> {
    return of({
      id: 'mockid',
      orderReference: 'DE--45',
      orders: [{ ...mockOrderData, shippingAddress: {}, billingAddress: {} }],
    });
  }
}
