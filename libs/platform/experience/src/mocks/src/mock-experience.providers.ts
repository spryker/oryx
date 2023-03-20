import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  BreakpointService,
  ComponentsRegistryService,
  ContentBackendUrl,
  DefaultBreakpointService,
  DefaultComponentsRegistryService,
  DefaultExperienceService,
  DefaultLayoutBuilder,
  ExperienceService,
  LayoutBuilder,
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
    provide: BreakpointService,
    useClass: DefaultBreakpointService,
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
