import { AppFeature } from '@spryker-oryx/core';
import { COMPONENT_MAPPING, RouterService } from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { componentsMapping } from './components';
import { StorefrontRouterService } from './router.service';
import { storefrontComponent } from './storefront.component';

export const storefrontProviders: Provider[] = [
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
];

export const storefrontApp: AppFeature = {
  providers: storefrontProviders,
  components: [storefrontComponent],
  options: {
    components: {
      root: storefrontComponent,
    },
  },
};
