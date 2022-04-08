import { CORE_PROVIDERS } from '@spryker-oryx/core';
import {
  ExperiencePreviewService,
  Services,
  STATIC_PROVIDERS,
} from '@spryker-oryx/experience';
import {
  ClassProvider,
  createInjector as _createInjector,
  Injector,
  Provider,
} from '@spryker-oryx/injector';
import { componentsMapping } from './components';
import { RouterService } from './router.service';

const previewModeProviders = (): Array<ClassProvider> => {
  if (
    new URLSearchParams(new URL(window.location.href).search).get('ebPreview')
  ) {
    return [
      {
        provide: Services.Experience,
        useClass: ExperiencePreviewService,
      },
    ];
  }
  return [];
};

previewModeProviders();

export const createInjector = (providers: Provider[] = []): Injector =>
  _createInjector({
    providers: [
      ...STATIC_PROVIDERS,
      ...previewModeProviders(),
      ...CORE_PROVIDERS,
      {
        provide: 'CONTENT_BACKEND_URL',
        useValue: import.meta.env.FES_CONTENT_BACKEND_URL || '',
      },
      {
        provide: Services.ComponentMapping,
        useValue: componentsMapping,
      },
      {
        provide: Services.Router,
        useClass: RouterService,
      },
      ...providers,
    ],
  });
