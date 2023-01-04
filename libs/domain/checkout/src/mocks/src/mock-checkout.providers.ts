import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutPaymentService,
  CheckoutService,
  CheckoutShipmentService,
  DefaultCheckoutDataService,
  DefaultCheckoutOrchestrationService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/di';
import { MockCheckoutService } from './mock-checkout.service';
import { MockPaymentService } from './mock-payment.service';
import { MockShipmentService } from './mock-shipment.service';

export const mockCheckoutProviders: Provider[] = [
  {
    provide: CheckoutShipmentService,
    useClass: MockShipmentService,
  },
  {
    provide: CheckoutPaymentService,
    useClass: MockPaymentService,
  },
  {
    provide: CheckoutDataService,
    useClass: DefaultCheckoutDataService,
  },
  {
    provide: CheckoutOrchestrationService,
    useClass: DefaultCheckoutOrchestrationService,
  },
  {
    provide: CheckoutService,
    useClass: MockCheckoutService,
  },
];
