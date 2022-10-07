import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { cartProviders } from './services';

export const cartComponents = Object.values(components);

export const cartFeature: AppFeature = {
  providers: cartProviders,
  components: cartComponents,
};
