import { Provider } from '@spryker-oryx/di';
import { ExperienceAdapter } from '@spryker-oryx/experience';
import { ContentExperienceAdapter } from './adapter';
import { ContentService } from './content.service';
import { DefaultContentService } from './default-content.service';
import { DefaultFontService, FontService } from './font';

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
];
