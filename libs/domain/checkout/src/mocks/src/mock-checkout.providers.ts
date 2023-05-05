import {
  CheckoutPaymentService,
  CheckoutService,
  CheckoutShipmentService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/di';
import { MockPaymentService } from './mock-payment.service';
import { MockShipmentService } from './mock-shipment.service';

import { ExperienceStaticData } from '@spryker-oryx/experience';
import { MockCheckoutService } from './mock-checkout.service';

export const checkoutOrchestratorStaticData = [
  {
    id: 'singlePage',
    components: [
      { type: 'oryx-checkout-auth' },
      { type: 'oryx-checkout-delivery' },
      { type: 'oryx-checkout-shipment' },
      { type: 'oryx-checkout-payment' },
    ],
  },
];

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
    provide: CheckoutService,
    useClass: MockCheckoutService,
  },
  {
    provide: ExperienceStaticData,
    useValue: checkoutOrchestratorStaticData,
  },
];
