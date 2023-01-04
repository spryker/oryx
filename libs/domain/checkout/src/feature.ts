import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { checkoutProviders } from './services';

export const checkoutComponents = Object.values(components);

export const checkoutFeature: AppFeature = {
  providers: checkoutProviders,
  components: checkoutComponents,
};
