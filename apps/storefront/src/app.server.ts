import { App } from '@spryker-oryx/core';
import { CORE_SERVER_PROVIDERS } from '@spryker-oryx/core/server';
import { storefront } from './config';

export const storefrontAppOrchestrator = async (): Promise<void | App> =>
  storefront
    .withOptions({
      components: {
        preload: true,
      },
    })
    .withProviders(CORE_SERVER_PROVIDERS)
    .create()
    .catch(console.error);
