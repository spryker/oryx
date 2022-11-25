import {
  CheckoutDataService,
  CheckoutOrchestrationService,
  CheckoutShipmentService,
  DefaultCheckoutDataService,
  DefaultCheckoutOrchestrationService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/injector';
import { MockShipmentService } from './mock-shipment.service';

export const mockCheckoutProviders: Provider[] = [
  {
    provide: CheckoutShipmentService,
    useClass: MockShipmentService,
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
