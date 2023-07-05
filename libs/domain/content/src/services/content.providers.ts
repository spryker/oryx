import { PageMetaResolver } from '@spryker-oryx/core';
import { Provider } from '@spryker-oryx/di';
import {
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
} from './article-context';
import { ContentService } from './content.service';
import { DefaultContentService } from './default-content.service';
import { DefaultFontService } from './default-font.service';
import { FontService } from './fonts.service';
import {
  ArticlePageDescriptionMetaResolver,
  ArticlePageTitleMetaResolver,
} from './resolvers';

export const contentProviders: Provider[] = [
  {
    provide: ContentService,
    useClass: DefaultContentService,
  },
  {
    provide: FontService,
    useClass: DefaultFontService,
  },
  ArticleIdContextFallback,
  ArticleTypeContextFallback,
  {
    provide: PageMetaResolver,
    useClass: ArticlePageTitleMetaResolver,
  },
  {
    provide: PageMetaResolver,
    useClass: ArticlePageDescriptionMetaResolver,
  },
];
