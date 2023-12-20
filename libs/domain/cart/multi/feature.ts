import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { multiCartsProviders } from './providers';
export * from './components';

export const multiCartComponents = Object.values(components);

export const multiCartFeature: AppFeature = {
  defaultOptions: { cart: { multi: true } },
  providers: multiCartsProviders,
  components: multiCartComponents,
};
