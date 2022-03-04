import { STATIC_PROVIDERS } from '@spryker-oryx/experience';
import { createInjector, inject } from '@spryker-oryx/injector';

export const setupInjector = () => {
  createInjector({
    providers: [
      ...STATIC_PROVIDERS,
      {
        provide: 'CONTENT_BACKEND_URL',
        useValue: 'http://localhost:3013',
      },
    ],
  });
};
