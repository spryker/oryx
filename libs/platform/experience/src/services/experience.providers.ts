import { injectEnv, PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  AppReadyExperienceDataRevealer,
  ColorModeExperienceDataRevealer,
  DefaultExperienceDataClientService,
  ExperienceDataClientService,
  ExperienceDataRevealer,
  GraphicsExperienceDataRevealer,
  OptionsExperienceDataRevealer,
  SchemaExperienceDataRevealer,
} from './data-client';
import {
  DefaultExperienceService,
  ExperienceService,
  PreviewExperienceService,
} from './experience';
import {
  DefaultExperienceDataService,
  ExperienceDataService,
} from './experience-data';
import { ContentBackendUrl } from './experience-tokens';
import {
  DefaultLayoutBuilder,
  DefaultLayoutService,
  DefaultScreenService,
  LayoutBuilder,
  LayoutService,
  ScreenService,
} from './layout';
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
    provide: LayoutService,
    useClass: DefaultLayoutService,
  },
  {
    provide: ComponentsRegistryService,
    useClass: DefaultComponentsRegistryService,
  },
  {
    provide: PageMetaResolver,
    useClass: ContentPageMetaResolver,
  },
  {
    provide: ExperienceDataService,
    useClass: DefaultExperienceDataService,
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
  {
    provide: ExperienceDataRevealer,
    useClass: SchemaExperienceDataRevealer,
  },
  {
    provide: ExperienceDataRevealer,
    useClass: AppReadyExperienceDataRevealer,
  },
  {
    provide: ExperienceDataRevealer,
    useClass: GraphicsExperienceDataRevealer,
  },
  {
    provide: ExperienceDataRevealer,
    useClass: OptionsExperienceDataRevealer,
  },
  {
    provide: ExperienceDataRevealer,
    useClass: ColorModeExperienceDataRevealer,
  },
  {
    provide: ExperienceDataRevealer,
    useClass: ColorModeExperienceDataRevealer,
  },
];
