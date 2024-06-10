import { mockDefaultCart } from '@spryker-oryx/cart/mocks';
import {
  CheckoutAdapter,
  CheckoutData,
  CheckoutResponse,
  PlaceOrderData,
} from '@spryker-oryx/checkout';
import { Observable, of } from 'rxjs';

export class MockCheckoutAdapter implements CheckoutAdapter {
  get(props: PlaceOrderData): Observable<CheckoutData> {
    const checkoutData = {
      addresses: [props.billingAddress, props.shippingAddress],
      paymentProviders: 1,
      selectedShipmentMethods: 1,
      selectedPaymentMethods: 1,
      paymentMethods: [...props.payments],
      shipments: [...props.shipments],
      carriers: 1,
      shipment: props.shipment,
      carts: {
        id: props.cartId,
        ...mockDefaultCart,
      },
    };

    return of(checkoutData);
  }

  placeOrder(data: PlaceOrderData): Observable<CheckoutResponse> {
    return undefined;
  }
}
