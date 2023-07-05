import { Provider } from '@spryker-oryx/di';
import { ContentService } from './content.service';
import { DefaultContentService } from './default-content.service';
import { DefaultFontService } from './default-font.service';
import { FontService } from './fonts.service';

export const contentProviders: Provider[] = [
  {
    provide: ContentService,
    useClass: DefaultContentService,
  },
  {
    provide: FontService,
    useClass: DefaultFontService,
  },
];
