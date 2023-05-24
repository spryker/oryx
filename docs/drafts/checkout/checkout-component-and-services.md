## Checkout components and CheckoutOrchestrationService

`CheckoutOrchestrationService` is the main service that orchestrates the checkout process.

```mermaid
flowchart TD

CheckoutComposition[oryx-checkout-composition]
CheckoutAuth[checkout-auth]
CheckoutDelivery[oryx-checkout-delivery]
CheckoutContact[checkout-contact]
CheckoutAddress[checkout-address]
CheckoutShipment[checkout-shipment]
CheckoutPayment[checkout-payment]

CheckoutOrchestrationService([CheckoutOrchestrationService])

CheckoutComposition --> CheckoutAuth
CheckoutComposition --> CheckoutDelivery
CheckoutComposition --> CheckoutShipmentSelector

CheckoutDelivery --> CheckoutContact
CheckoutDelivery --> CheckoutAddress

CheckoutComposition --> CheckoutPaymentSelector

CheckoutShipmentSelector -.-> CheckoutOrchestrationService
CheckoutPaymentSelector -.-> CheckoutOrchestrationService
CheckoutDelivery -.-> CheckoutOrchestrationService

AddressForm[user-address-form]
AddressList[user-address-list]

CheckoutAddress --> AddressForm
CheckoutAddress --> AddressList

ChecoutPlaceOrder[checkout-place-order]
ChecoutPlaceOrder-.-> CheckoutOrchestrationService

```

## CheckoutDataService

`CheckoutDataService` is used to set checkout data during the checkout flow.
It is also responsible for persisting the checkout data in the session storage, to be able to restore the checkout flow in case of a page refresh.

```mermaid
flowchart TD

CheckoutComposition[oryx-checkout-composition]
CheckoutAuth[checkout-auth]
CheckoutDelivery[oryx-checkout-delivery]
CheckoutContact[checkout-contact]
CheckoutAddress[checkout-address]
CheckoutShipmentSelector[checkout-shipment]
CheckoutPaymentSelector[checkout-payment]

CheckoutDataService([CheckoutDataService])

CheckoutComposition --> CheckoutAuth
CheckoutComposition --> CheckoutDelivery
CheckoutComposition --> CheckoutShipmentSelector

CheckoutDelivery --> CheckoutContact
CheckoutDelivery --> CheckoutAddress

CheckoutComposition --> CheckoutPaymentSelector


AddressForm[user-address-form]
AddressList[user-address-list]

CheckoutAddress --> AddressForm
CheckoutAddress --> AddressList

CheckoutAuth -.-> CheckoutDataService
CheckoutPaymentSelector  -.-> CheckoutPaymentService -.-> CheckoutDataService
CheckoutShipmentSelector -.-> CheckoutShipmentService -.-> CheckoutDataService
CheckoutContact -.-> CheckoutDataService
CheckoutAddress -.-> CheckoutDataService

```

## CheckoutShipmentService

`CheckoutShipmentService` is used to set shipment data during the checkout flow. It also exposes available shipment methods for the shipment step.

```mermaid
flowchart TD

CheckoutComposition[oryx-checkout-composition]
CheckoutShipmentSelector[checkout-shipment]

CheckoutOrchestrationService([CheckoutOrchestrationService])
CheckoutAdapter([CheckoutAdapter])
CheckoutDataService([CheckoutDataService])
CheckoutShipmentService([CheckoutShipmentService])

CheckoutComposition --> CheckoutShipmentSelector -.-> CheckoutShipmentService -.setShipmentMethod.-> CheckoutDataService

CheckoutShipmentService -.getCarriers.-> CheckoutAdapter

CheckoutShipmentSelector -.-> CheckoutOrchestrationService

```

## CheckoutPlaceOrderComponent and CheckoutService

`CheckoutService` is used to finalize an order. It uses:

- `CheckoutOrchestrationService` to make sure, all required steps are completed
- `CheckoutDataService` to get the data for the order
- `CheckoutAdapter` to place the order

```mermaid
flowchart TD

CheckoutService([CheckoutSrevice])
CheckoutOrchestrationService([CheckoutOrchestrationService])
CheckoutDataService([CheckoutDataService])
CheckoutAdapter([CheckoutAdapter])

CheckoutService -.validate.-> CheckoutOrchestrationService
CheckoutService -.collect data.-> CheckoutDataService
CheckoutService -.place the order.-> CheckoutAdapter

ChecoutPlaceOrder[checkout-place-order]
ChecoutPlaceOrder-.placeOrder.-> CheckoutService

```

### \*Graph Legend

```mermaid
flowchart LR

Component1[Component1] --componnet hierarchy --> Component2[Component2] -.service dependency.-> Service1([Service1]) -.-> Service2([Service2])
```

- Components are represented by rectangles
- Services are represented by stadium shapes
- solid lines represent component hierarchy (DOM structure)
- dotted lines represent service dependencies
