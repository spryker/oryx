import { provideEntity } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ExperienceAdapter,
  ExperienceDataRevealer,
} from '@spryker-oryx/experience';
import { ContentExperienceAdapter } from './adapter';
import {
  contentfulProviders,
  storyblokProviders,
  strapiProviders,
} from './cms';
import { ContentContext } from './content-context';
import { ContentService } from './content.service';
import { DefaultContentService } from './default-content.service';
import { DefaultFontService, FontService } from './font';
import { ContentConfigExperienceDataRevealer } from './revealers';

export const contentProviders: Provider[] = [
  {
    provide: ExperienceAdapter,
    useClass: ContentExperienceAdapter,
  },
  {
    provide: ContentService,
    useClass: DefaultContentService,
  },
  {
    provide: FontService,
    useClass: DefaultFontService,
  },
  ...contentfulProviders,
  ...storyblokProviders,
  ...strapiProviders,
  provideEntity('content', {
    service: ContentService,
    context: ContentContext.Content,
  }),
];

export const contentPreviewProviders: Provider[] = [
  {
    provide: ExperienceDataRevealer,
    useClass: ContentConfigExperienceDataRevealer,
  },
];
