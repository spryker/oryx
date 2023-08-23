import { injectEnv, PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import { ContentfulSpace, ContentfulToken } from '../models';
import { DefaultExperienceAdapter, ExperienceAdapter } from './adapter';
import {
  CmsAdapter,
  cmsFieldNormalizers,
  cmsFieldsNormalizers,
  cmsItemsNormalizers,
  cmsTypesNormalizers,
  ContentfulCmsAdapter,
} from './cms';
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

export const adapterProviders: Provider[] = [
  {
    provide: ContentBackendUrl,
    useFactory: () => injectEnv('FES_CONTENT_BACKEND_URL', ''),
  },
  {
    provide: ContentfulToken,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_TOKEN', ''),
  },
  {
    provide: ContentfulSpace,
    useFactory: () => injectEnv('ORYX_CONTENTFUL_SPACE', ''),
  },
  ...cmsItemsNormalizers,
  ...cmsTypesNormalizers,
  ...cmsFieldNormalizers,
  ...cmsFieldsNormalizers,
];

export const experienceProviders: Provider[] = [
  {
    provide: ExperienceAdapter,
    useClass: DefaultExperienceAdapter,
  },
  {
    provide: CmsAdapter,
    useClass: ContentfulCmsAdapter,
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
  ...adapterProviders,
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
