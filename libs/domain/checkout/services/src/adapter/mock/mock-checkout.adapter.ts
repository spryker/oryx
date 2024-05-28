import {
  Address,
  ApiCheckoutModel, Carrier,
  CheckoutAdapter,
  CheckoutData,
  CheckoutResponse, ContactDetails, PaymentMethod,
  PlaceOrderData, Shipment
} from "@spryker-oryx/checkout";
import {Observable, of} from "rxjs";
import {Cart} from "@spryker-oryx/cart";
import { mockDefaultCart } from "@spryker-oryx/cart/mocks";

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
        ...mockDefaultCart
      }
    }

    return of(checkoutData)
  }

  placeOrder(data: PlaceOrderData): Observable<CheckoutResponse> {
    return undefined;
  }
}
