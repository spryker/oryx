import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { orderProviders } from './services';

export const orderComponents = Object.values(components);

export const orderFeature: AppFeature = {
  providers: orderProviders,
  components: orderComponents,
};
