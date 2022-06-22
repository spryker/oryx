import { CART_PROVIDERS } from '@spryker-oryx/cart';
import { CORE_PROVIDERS } from '@spryker-oryx/core';
import {
  COMPONENT_MAPPING,
  ExperienceService,
  PreviewExperienceService,
  RouterService,
  STATIC_PROVIDERS,
} from '@spryker-oryx/experience';
import {
  ClassProvider,
  createInjector as _createInjector,
  Injector,
  Provider,
} from '@spryker-oryx/injector';
import { PRODUCT_PROVIDERS } from '@spryker-oryx/product';
import 'urlpattern-polyfill';
import { componentsMapping } from './components';
import { StorefrontRouterService } from './router.service';

const previewModeProviders = (): Array<ClassProvider> => {
  if (
    new URLSearchParams(new URL(window.location.href).search).get('ebPreview')
  ) {
    return [
      {
        provide: ExperienceService,
        useClass: PreviewExperienceService,
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
        provide: 'SCOS_BASE_URL',
        useValue: import.meta.env.SCOS_BASE_URL || '',
      },
      {
        provide: COMPONENT_MAPPING,
        useValue: componentsMapping,
      },
      {
        provide: RouterService,
        useClass: StorefrontRouterService,
      },
      ...PRODUCT_PROVIDERS,
      ...CART_PROVIDERS,
      ...providers,
    ],
  });
