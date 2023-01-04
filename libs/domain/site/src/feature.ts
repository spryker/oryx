import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { siteProviders } from './services';
export * from './components';

export const siteComponents = Object.values(components);

export const siteFeature: AppFeature = {
  providers: siteProviders,
  components: siteComponents,
};
