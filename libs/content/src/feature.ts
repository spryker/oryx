import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
export * from './components';

export const contentComponents = Object.values(components);

export const contentFeature: AppFeature = {
  components: contentComponents,
};
