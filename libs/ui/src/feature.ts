import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
export * from './components';

export const uiComponents = Object.values(components);

export const uiFeature: AppFeature = {
  components: uiComponents,
};
