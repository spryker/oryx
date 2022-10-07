import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { authProviders } from './services/providers';
export * from './components';

export const authComponents = Object.values(components);

export const authFeature: AppFeature = {
  providers: authProviders,
  components: authComponents,
};
