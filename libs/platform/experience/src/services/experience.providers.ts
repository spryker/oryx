import { injectEnv } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { DefaultLayoutService, LayoutService } from '../../layout/src';
import {
  BreakpointService,
  DefaultBreakpointService,
  DefaultExperienceDataClientService,
  DefaultExperienceService,
  DefaultLayoutBuilder,
  ExperienceDataClientService,
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
    provide: LayoutService,
    useClass: DefaultLayoutService,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
];

export const experiencePreviewProviders: Provider[] = [
  {
    provide: ExperienceDataClientService,
    useClass: DefaultExperienceDataClientService,
  },
  {
    provide: ExperienceService,
    useClass: PreviewExperienceService,
  },
];
