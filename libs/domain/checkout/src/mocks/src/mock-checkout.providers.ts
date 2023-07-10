import {
  CheckoutDataService,
  CheckoutService,
  CheckoutStateService,
  DefaultCheckoutStateService,
} from '@spryker-oryx/checkout';
import { Provider } from '@spryker-oryx/di';

import { StorageService } from '@spryker-oryx/core';
import { ExperienceStaticData } from '@spryker-oryx/experience';
import { MockCheckoutDataService } from './mock-checkout-data.service';
import { MockCheckoutService } from './mock-checkout.service';
import { MockStorageService } from './mock-storage.service';

export const checkoutOrchestratorStaticData = [
  {
    id: 'singlePage',
    components: [
      { type: 'oryx-checkout-account' },
      { type: 'oryx-checkout-delivery' },
      { type: 'oryx-checkout-shipping-method' },
      { type: 'oryx-checkout-payment-method' },
    ],
  },
];

export const mockCheckoutProviders: Provider[] = [
  {
    provide: CheckoutService,
    useClass: MockCheckoutService,
  },
  {
    provide: CheckoutDataService,
    useClass: MockCheckoutDataService,
  },
  {
    provide: CheckoutStateService,
    useClass: DefaultCheckoutStateService,
  },
  {
    provide: StorageService,
    useClass: MockStorageService,
  },
  {
    provide: ExperienceStaticData,
    useValue: checkoutOrchestratorStaticData,
  },
];
