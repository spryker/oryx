import { CheckoutShipmentService } from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/injector';
import { MockShipmentService } from './mock-shipment.service';

export const mockCheckoutProviders: Provider[] = [
  {
    provide: CheckoutShipmentService,
    useClass: MockShipmentService,
  },
];
