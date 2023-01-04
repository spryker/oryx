import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { userProviders } from './services';
export * from './components';

export const userComponents = Object.values(components);

export const userFeature: AppFeature = {
  providers: userProviders,
  components: userComponents,
};
