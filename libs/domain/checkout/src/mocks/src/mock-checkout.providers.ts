import { CheckoutService } from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/di';

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
    provide: CheckoutService,
    useClass: MockCheckoutService,
  },
  {
    provide: ExperienceStaticData,
    useValue: checkoutOrchestratorStaticData,
  },
];
