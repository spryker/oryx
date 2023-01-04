import { injectEnv } from '@spryker-oryx/core';
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
  RouterService,
} from '@spryker-oryx/experience';
import { Provider } from '@spryker-oryx/injector';
import { componentsProvider } from '../../services/components.provider';
import { MockRouterService } from './mock-router.service';

export const mockExperienceProviders: Provider[] = [
  componentsProvider,
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
