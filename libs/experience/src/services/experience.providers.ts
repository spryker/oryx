import { injectEnv, SsrOptions } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/injector';
import { componentsProvider } from './components.provider';
import {
  BreakpointService,
  DefaultBreakpointService,
  DefaultExperienceService,
  DefaultLayoutBuilder,
  ExperienceService,
  LayoutBuilder,
  PreviewExperienceService,
} from './experience';
import { ContentBackendUrl } from './experience-tokens';
import {
  ComponentsRegistryService,
  DefaultComponentsRegistryService,
} from './registry';

declare global {
  interface AppEnvironment {
    readonly FES_CONTENT_BACKEND_URL?: string;
  }
}

export const experienceProviders: Provider[] = [
  componentsProvider,
  {
    provide: ContentBackendUrl,
    useFactory: () => injectEnv('FES_CONTENT_BACKEND_URL', ''),
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

export const experiencePreviewProviders: Provider[] = [
  {
    provide: ExperienceService,
    useClass: PreviewExperienceService,
  },
  {
    provide: SsrOptions,
    useValue: {
      initialNavigation: true,
    },
  },
];
