import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ComponentsRegistryService,
  ContentBackendUrl,
  DefaultComponentsRegistryService,
  DefaultExperienceService,
  DefaultLayoutBuilder,
  DefaultScreenService,
  ExperienceService,
  LayoutBuilder,
  ScreenService,
} from '@spryker-oryx/experience';
import { RouterService } from '@spryker-oryx/router';
import { MockRouterService } from './mock-router.service';

export const mockExperienceProviders: Provider[] = [
  {
    provide: ContentBackendUrl,
    useFactory: () => injectEnv('FES_CONTENT_BACKEND_URL', ''),
  },
  {
    provide: RouterService,
    useClass: MockRouterService,
  },
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
  },
  {
    provide: ScreenService,
    useClass: DefaultScreenService,
  },
  {
    provide: LayoutBuilder,
    useClass: DefaultLayoutBuilder,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
];
