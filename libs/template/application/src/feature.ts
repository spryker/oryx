import { AppFeature } from '@spryker-oryx/core';
import { isServer } from 'lit';
import * as components from './components';
import { RootPlugin } from './plugins';
export * from './components';

export const applicationComponents = Object.values(components);

export const applicationFeature: AppFeature = {
  components: applicationComponents,
  plugins: isServer ? [] : [new RootPlugin()],
  options: {
    components: {
      preload: isServer,
      root: components.rootAppComponent,
    },
  },
};
