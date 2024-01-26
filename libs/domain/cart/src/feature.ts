import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { glueCartProviders } from './services';
export * from './components';

export const cartComponents = Object.values(components);

export const cartFeature: AppFeature = {
  providers: glueCartProviders,
  components: cartComponents,
};
