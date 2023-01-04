import { checkoutComponents } from '@spryker-oryx/checkout';
import { AppFeature } from '@spryker-oryx/core';
import { mockCheckoutProviders } from './src';

export const mockCheckoutFeature: AppFeature = {
  providers: mockCheckoutProviders,
  components: checkoutComponents,
};
