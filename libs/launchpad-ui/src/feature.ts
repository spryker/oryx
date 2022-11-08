import { AppFeature } from '@spryker-oryx/core';
import * as components from './components';
export * from './components';

const launchpadUiComponents = Object.values(components);

export const launchpadUiFeature: AppFeature = {
  components: launchpadUiComponents,
};
