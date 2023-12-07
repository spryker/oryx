import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { merchantProviders } from './services';
export * from './components';

export const merchantComponents = Object.values(components);

export const merchantFeature: AppFeature = {
  providers: merchantProviders,
  components: merchantComponents,
};
