import { ContentComponentSchema } from '@spryker-oryx/experience';
import { IconTypes } from '@spryker-oryx/ui/icon';
import { ArticlesComponent } from './articles.component';

export const articlesSchema: ContentComponentSchema<ArticlesComponent> = {
  name: 'Article',
  group: 'Content',
  icon: IconTypes.Description,
};
