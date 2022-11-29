import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutPaymentService,
  CheckoutShipmentService,
  DefaultCheckoutDataService,
  DefaultCheckoutOrchestrationService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/injector';
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
];
