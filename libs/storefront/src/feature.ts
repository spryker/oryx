import { AppFeature } from '@spryker-oryx/core';
import { isClient } from '@spryker-oryx/typescript-utils';
import { storefrontComponent } from '../storefront/src/component';
import { StorefrontPlugin } from './plugins';
import { routerProviders } from './router';

export const storefrontFeature: AppFeature = {
  providers: routerProviders,
  components: [storefrontComponent],
  plugins: isClient() ? [new StorefrontPlugin()] : [],
  options: {
    components: {
      preload: !isClient(),
      root: storefrontComponent,
    },
  },
};
