import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ComponentsRegistryService,
  ContentBackendUrl,
  DefaultComponentsRegistryService,
  DefaultExperienceDataService,
  DefaultExperienceService,
  DefaultLayoutBuilder,
  DefaultLayoutService,
  DefaultScreenService,
  ExperienceDataService,
  ExperienceService,
  LayoutBuilder,
  LayoutService,
  ScreenService,
  layoutPluginsProviders,
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
    provide: LayoutService,
    useClass: DefaultLayoutService,
  },
  {
    provide: LayoutBuilder,
    useClass: DefaultLayoutBuilder,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
  {
    provide: ExperienceDataService,
    useClass: DefaultExperienceDataService,
  },
  ...layoutPluginsProviders,
];
