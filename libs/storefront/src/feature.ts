import { AppFeature } from '@spryker-oryx/core';
import { isClient } from '@spryker-oryx/typescript-utils';
import * as components from './components';
import { StorefrontPlugin } from './plugins';
import { routerProviders } from './router';
export * from './components';

export const storefrontComponents = Object.values(components);

export const storefrontFeature: AppFeature = {
  providers: routerProviders,
  components: storefrontComponents,
  plugins: isClient() ? [new StorefrontPlugin()] : [],
  options: {
    components: {
      preload: !isClient(),
      root: components.storefrontComponent,
    },
  },
};
