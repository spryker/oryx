import { injectEnv, PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { CmsToken } from '../models';
import { cmsNormalizer, ExperienceAdapter } from './adapter';
import { CmsExperienceAdapter } from './adapter/cms-experience.adapter';
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

export const layoutProviders: Provider[] = [
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
];

export const experienceProviders: Provider[] = [
  {
    provide: ContentBackendUrl,
    useFactory: () => injectEnv('FES_CONTENT_BACKEND_URL', ''),
  },
  {
    provide: CmsToken,
    useFactory: () => injectEnv('ORYX_CMS_TOKEN', ''),
  },
  {
    provide: ExperienceAdapter,
    useClass: CmsExperienceAdapter,
  },
  {
    provide: ExperienceService,
    useClass: DefaultExperienceService,
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
  ...layoutProviders,
  ...cmsNormalizer,
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
