import { Provider } from '@spryker-oryx/di';
import { ArticleContextFallback } from './article-context';
import { ContentService } from './content.service';
import { DefaultContentService } from './default-content.service';

export const contentProviders: Provider[] = [
  {
    provide: ContentService,
    useClass: DefaultContentService,
  },
  ArticleContextFallback,
];
