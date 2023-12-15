import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
export * from './components';

export const multiCartComponents = Object.values(components);

export const multiCartFeature: AppFeature = {
  defaultOptions: { cart: { multi: true } },
  components: multiCartComponents,
};