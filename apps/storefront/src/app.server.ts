import { App } from '@spryker-oryx/core';
import { coreServerProviders } from '@spryker-oryx/core/server';
import { storefront } from './config';

export const storefrontAppOrchestrator = async (): Promise<void | App> =>
  storefront
    .withOptions({
      components: {
        preload: true,
      },
    })
    .withProviders(coreServerProviders)
    .create()
    .catch(console.error);
