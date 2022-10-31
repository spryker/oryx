import { AppFeature } from '@spryker-oryx/core';
import { isServer } from 'lit';
import * as components from './components';
import { StorefrontPlugin } from './plugins';
import { routerProviders } from './router';
export * from './components';

export const storefrontComponents = Object.values(components);

export const storefrontFeature: AppFeature = {
  providers: routerProviders,
  components: storefrontComponents,
  plugins: isServer ? [] : [new StorefrontPlugin()],
  options: {
    components: {
      preload: isServer,
      root: components.storefrontComponent,
    },
  },
};
