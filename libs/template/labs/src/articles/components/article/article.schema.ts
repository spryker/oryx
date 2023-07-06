import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ArticleComponent } from './article.component';

export const articleSchema: ContentComponentSchema<ArticleComponent> = {
  name: 'Article',
  group: 'Content',
  icon: IconTypes.Description,
};
