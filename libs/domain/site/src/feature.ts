import { AppFeature } from '@spryker-oryx/core';
import * as components from './components/def';
import { siteProviders } from './services';
export * from './components.def';

export const siteComponents = Object.values(components);

export const siteFeature: AppFeature = {
  providers: siteProviders,
  components: siteComponents,
};
