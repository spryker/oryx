import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';

export const authComponents = Object.values(components);

export const checkoutFeature: AppFeature = {
  components: authComponents,
};
