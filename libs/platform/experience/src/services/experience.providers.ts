import { injectEnv, PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  DefaultExperienceDataClientService,
  DefaultExperienceService,
  DefaultLayoutBuilder,
  DefaultScreenService,
  ExperienceDataClientService,
  ExperienceService,
  LayoutBuilder,
  PreviewExperienceService,
  ScreenService,
} from './experience';
import { ContentBackendUrl } from './experience-tokens';
import {
  ComponentsRegistryService,
  DefaultComponentsRegistryService,
} from './registry';
import { ContentPageMetaResolver } from './resolvers';

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
  {
    provide: PageMetaResolver,
    useClass: ContentPageMetaResolver,
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
