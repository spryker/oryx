import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
import { contentProviders } from './services';
export * from './components';

export const contentComponents = Object.values(components);

export const contentFeature: AppFeature = {
  providers: contentProviders,
  components: contentComponents,
};
